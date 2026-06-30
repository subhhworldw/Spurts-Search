import { parseNaturalLanguageQuery, buildNCBIQuery } from "./src/lib/searchQueryBuilder";

const query = "breast cancer protein";
const parsed = parseNaturalLanguageQuery(query);
const ncbiQ = buildNCBIQuery(parsed);

import https from "https";

https.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=protein&term=${encodeURIComponent(ncbiQ)}&retmode=json&retmax=5`, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed.esearchresult.idlist);
    } catch (e) {
      console.error(e);
    }
  });
});
