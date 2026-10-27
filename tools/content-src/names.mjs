// Country names that need “the” in a sentence: the capital of the Netherlands, this is the United States.
const THE = /^(United |Netherlands|Philippines|Democratic Republic|Republic of|Czech Republic|Central African|Dominican Republic|Gambia|Bahamas|Maldives|Solomon Islands|Marshall Islands|Comoros|Seychelles)/;
export const the = (name) => (THE.test(name) ? `the ${name}` : name);
