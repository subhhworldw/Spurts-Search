import https from "https";
https.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi?db=protein&term=brcca1&retmode=json`, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed?.esearchresult?.spelledquery);
    } catch (e) {
      console.error(e);
    }
  });
});
