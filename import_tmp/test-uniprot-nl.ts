import https from "https";
https.get(`https://rest.uniprot.org/uniprotkb/search?query=BRCA2&format=json&size=3`, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed.results.map((r: any) => r.uniProtkbId));
    } catch (e) {
      console.error(e);
    }
  });
});
