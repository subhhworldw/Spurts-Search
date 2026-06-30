import { parseNaturalLanguageQuery, buildUniProtQuery } from "./src/lib/searchQueryBuilder";

const query = "BRCA1_HUMAN";
const parsed = parseNaturalLanguageQuery(query);
const uniprotQ = buildUniProtQuery(parsed);

import https from "https";

https.get(`https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(uniprotQ)}&format=json&size=5`, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed.results?.length || 0);
    } catch (e) {
      console.error(e);
    }
  });
});
