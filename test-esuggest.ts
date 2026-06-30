import https from "https";
https.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esuggest.fcgi?db=nucleotide&term=BRCA1&retmode=json`, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed);
    } catch (e) {
      console.error(e);
      console.log(data);
    }
  });
});
