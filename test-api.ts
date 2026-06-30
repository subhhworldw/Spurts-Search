import http from "http";
import https from "https";

https.get("https://rest.uniprot.org/uniprotkb/search?query=BRCA1&format=json&size=3", (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed.results.map((i: any) => i.uniProtkbId));
    } catch (e) {
      console.error(e);
    }
  });
});
