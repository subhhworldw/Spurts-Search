import https from "https";
https.get(`https://rest.uniprot.org/uniprotkb/search?query=BRCA1_HUMAN&format=json&size=5`, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed.results.map((r: any) => r.primaryAccession));
    } catch (e) {
      console.error(e);
    }
  });
});
