import { parseNaturalLanguageQuery, buildNCBIQuery, buildUniProtQuery, buildPDBQuery } from "./src/lib/searchQueryBuilder";

const query = "breast cancer protein";
const parsed = parseNaturalLanguageQuery(query);
console.log("Parsed:", parsed);
console.log("NCBI:", buildNCBIQuery(parsed));
console.log("UniProt:", buildUniProtQuery(parsed));
console.log("PDB:", JSON.stringify(buildPDBQuery(parsed), null, 2));
