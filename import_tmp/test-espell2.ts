import https from "https";
https.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi?db=protein&term=brcca1`, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log(data);
  });
});
