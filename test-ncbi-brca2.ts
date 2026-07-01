fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nucleotide&term=brca%20AND%202&retmode=json&retmax=5').then(r=>r.json()).then(j=>console.log(j));
