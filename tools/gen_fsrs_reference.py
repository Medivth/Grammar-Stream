"""Generate FSRS reference values from py-fsrs for tests/fsrs.test.mjs.

Usage: pip install fsrs && python tools/gen_fsrs_reference.py > tests/fixtures/fsrs_reference.json
Each case is a list of (day offset, rating); we record stability, difficulty
and interval after every review. Fuzz off, no learning/relearning steps,
reviews at midnight UTC so elapsed days are whole numbers.
"""
import json
import random
from datetime import datetime, timedelta, timezone

from fsrs import Card, Rating, Scheduler

random.seed(7)
BASE = datetime(2026, 11, 2, tzinfo=timezone.utc)


def run(case, retention):
    sched = Scheduler(learning_steps=(), relearning_steps=(), enable_fuzzing=False,
                      desired_retention=retention)
    card = Card()
    out = []
    for day, rating in case:
        card, _ = sched.review_card(card, Rating(rating), review_datetime=BASE + timedelta(days=day))
        out.append({
            "day": day,
            "rating": rating,
            "s": card.stability,
            "d": card.difficulty,
            "ivl": (card.due - card.last_review).days,
        })
    return out


cases = [
    [(0, 3), (3, 3), (12, 3), (40, 3)],
    [(0, 1), (0, 3), (1, 3), (4, 1), (5, 3), (9, 4)],
    [(0, 4), (8, 4), (40, 3)],
    [(0, 3), (0, 1), (0, 3), (2, 2), (5, 3)],
    [(0, 3), (30, 1), (31, 3), (36, 3)],
]
# random cases following the scheduler's own due dates, with some early and late reviews
for _ in range(15):
    day, case = 0, []
    sched = Scheduler(learning_steps=(), relearning_steps=(), enable_fuzzing=False)
    card = Card()
    for _ in range(8):
        r = random.choice([1, 3, 3, 3, 4])
        case.append((day, r))
        card, _ = sched.review_card(card, Rating(r), review_datetime=BASE + timedelta(days=day))
        ivl = (card.due - card.last_review).days
        day += max(0, ivl + random.choice([-1, 0, 0, 2, 5]))
    cases.append(case)

result = []
for retention in (0.9, 0.85):
    for case in cases:
        result.append({"retention": retention, "steps": run(case, retention)})
print(json.dumps(result, indent=1))
