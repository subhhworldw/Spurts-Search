export const TOOLTIP_DATA: Record<string, any> = {
  // ── SEARCH BAR ──────────────────────────
  "search-bar": {
    icon: "🔍",
    title: "Search Bar",
    what: "Accepts gene names, protein names, accession IDs, or free-text keywords and searches across all three biological databases simultaneously.",
    why: "One search box replaces having to visit GenBank, UniProt, and PDB separately.",
    usecase: "A student researching the BRCA2 gene types its name and instantly gets DNA sequences, protein data, and 3D structures in one page.",
    example: "Try: BRCA2 · insulin · P04637 · 4HHB · TP53 human",
    tip: "Press / anywhere on the page to instantly focus the search bar without using your mouse."
  },

  "query-type-badge": {
    icon: "🏷",
    title: "Auto-Detected Query Type",
    what: "As you type, Spurt Search recognizes your input format and tells you which database it will search — before you even press Enter.",
    why: "Prevents wasted searches and helps you understand which database holds the data you need.",
    usecase: "A researcher types 'P04637' and the badge immediately shows 🔵 UniProt ID, confirming they're looking at a protein accession.",
    example: "P04637 → UniProt · 4HHB → PDB · NM_007294 → GenBank · BRCA2 → All",
    tip: "ID formats: UniProt = letter + 5 chars (P04637). PDB = 4 chars starting with a number (4HHB). NCBI = prefix + underscore (NM_, NP_, NC_)."
  },

  "search-autocomplete": {
    icon: "✨",
    title: "Search Suggestions",
    what: "Shows live suggestions from NCBI and UniProt as you type, so you can pick the right entry without finishing the full ID.",
    why: "Saves time and prevents typos — especially useful when you half-remember a gene name.",
    usecase: "A student types 'brc' and sees 'BRCA1', 'BRCA2', 'BRCC3' as suggestions with their organism listed next to each.",
    example: "Type 'ins' → insulin (Human), insulin (Mouse), insig1...",
    tip: "Use arrow keys to navigate suggestions, Enter to select, Escape to dismiss."
  },

  // ── FILTERS ──────────────────────────────
  "filter-database": {
    icon: "🗄",
    title: "Database Filter",
    what: "Limits results to one or more of the three databases: GenBank (DNA/RNA sequences), UniProt (proteins), or PDB (3D structures).",
    why: "If you only need protein data, filtering out GenBank and PDB removes irrelevant results and speeds up the search.",
    usecase: "A researcher studying protein folding unchecks GenBank and UniProt to see only PDB crystal structures for their target.",
    example: "☑ PDB only → searching '1TUP' returns the p53-DNA complex structure, not raw sequences.",
    tip: "Each database has a color: 🔵 UniProt · 🟢 GenBank · 🟠 PDB. These colors are consistent everywhere in the app."
  },

  "filter-organism": {
    icon: "🦠",
    title: "Organism Filter",
    what: "Restricts results to entries from a specific species or taxonomic group. Type to search across all organisms in the database.",
    why: "The same gene exists in hundreds of species. Filtering saves you from sifting through mouse, yeast, and bacterial hits when you only want human data.",
    usecase: "Searching 'p53' returns results from 200+ species. Adding organism: Homo sapiens narrows it to human entries only.",
    example: "Homo sapiens · Mus musculus · Escherichia coli · Saccharomyces cerevisiae",
    tip: "You can type partial names: 'mus' matches Mus musculus, Musca domestica, etc. The count next to each organism shows how many results it has."
  },

  "filter-reviewed": {
    icon: "✅",
    title: "Reviewed (Swiss-Prot) Filter",
    what: "Filters UniProt results to show only manually reviewed entries (Swiss-Prot) versus computationally predicted entries (TrEMBL).",
    why: "Reviewed entries are curated by expert biologists and are far more reliable. For coursework and publications, always prefer reviewed.",
    usecase: "A student writing a lab report filters to Swiss-Prot only to ensure the protein function they cite has been experimentally verified.",
    example: "P04637 (p53, Human) — Reviewed ✓ Swiss-Prot · Reliable for citations",
    tip: "TrEMBL has millions more entries but lower confidence. Use TrEMBL when studying non-model organisms where reviewed data is scarce."
  },

  "filter-resolution": {
    icon: "🔭",
    title: "Structure Resolution Filter",
    what: "Filters PDB structures by crystallographic resolution in Ångströms (Å). Lower numbers mean sharper, more detailed atomic models.",
    why: "A 1.5Å structure reveals individual atoms clearly. A 4.0Å structure shows only the overall shape. Resolution matters for drug binding studies.",
    usecase: "A medicinal chemistry researcher sets the slider to ≤ 2.0Å to find only high-quality structures for computational docking.",
    example: "≤ 1.5Å = atomic detail · 1.5–2.5Å = high quality · 2.5–3.5Å = good · > 3.5Å = low resolution",
    tip: "Cryo-EM structures use different quality metrics (FSC). Resolution alone doesn't rank cryo-EM vs X-ray — check the experimental method too."
  },

  "filter-date": {
    icon: "📅",
    title: "Date Range Filter",
    what: "Filters results by the date the entry was deposited or last updated in the database.",
    why: "Older entries may have outdated annotations. Researchers following up on recent papers need entries from the last year.",
    usecase: "A PhD student reviewing recent discoveries about a protein sets the filter to 2023–2026 to find only newly deposited structures.",
    example: "Set to last 2 years → shows only structures deposited since 2024",
    tip: "UniProt entries are regularly re-annotated. An entry from 2005 might have been updated last month — check 'Last modified' in the detail panel."
  },

  "filter-length": {
    icon: "📏",
    title: "Sequence Length Filter",
    what: "Filters protein or nucleotide results by sequence length in amino acids (proteins) or base pairs (DNA/RNA).",
    why: "A 50 aa peptide behaves very differently from a 3,000 aa protein. Length filtering avoids irrelevant hits.",
    usecase: "A researcher looking for small antimicrobial peptides sets the max length to 100 aa, excluding large structural proteins.",
    example: "Insulin: 51 aa · p53: 393 aa · Titin (largest protein): 34,350 aa",
    tip: "For nucleotides, 1 gene = roughly 1,000–100,000 bp. Whole chromosomes are in the billions — filter to < 50,000 bp for typical gene searches."
  },

  // ── RESULTS ───────────────────────────────
  "result-card": {
    icon: "🃏",
    title: "Result Card",
    what: "Each card represents one entry from a database — a gene sequence, protein, or 3D structure. It shows the key facts at a glance.",
    why: "Lets you scan many results quickly and click into only the ones worth exploring further.",
    usecase: "A student searches 'insulin' and scans 20 cards to find the human version (Homo sapiens, P01308) vs the mouse version.",
    example: "Card = ID + name + organism + length + status + last updated",
    tip: "Click anywhere on the card body to open the full detail panel. Use the ⭐ icon to save it to your collection without opening it."
  },

  "compact-view": {
    icon: "☰",
    title: "Compact View",
    what: "Switches results from large cards to dense table rows — more entries visible per screen, less descriptive text shown.",
    why: "Experienced researchers who know what they're looking for prefer scanning a dense list. Students benefit from the fuller card layout.",
    usecase: "A researcher comparing 50 PDB structures for the same protein switches to compact view to see all entries without scrolling.",
    example: "Card view: 6 results/screen · Compact view: 20+ results/screen",
    tip: "Your view preference is saved automatically. You can also toggle it with the keyboard shortcut T."
  },

  "sort-results": {
    icon: "↕",
    title: "Sort Results",
    what: "Reorders results by relevance, date, sequence length, annotation score (UniProt), or structure resolution (PDB).",
    why: "Default relevance ranking is good for discovery. Sorting by date finds the newest science. Sorting by resolution finds the best structures.",
    usecase: "A researcher wants the highest-quality PDB structure for drug docking — they sort by resolution ascending to get the sharpest structures first.",
    example: "Relevance · Newest first · Longest sequence · Best resolution · Highest annotation score",
    tip: "Annotation score (UniProt) ranks how much experimental evidence backs an entry. Score 5 = fully characterized. Score 1 = predicted only."
  },

  "star-save": {
    icon: "⭐",
    title: "Save to Collection",
    what: "Bookmarks an entry to your personal collection, stored in your browser. Saved entries persist between sessions.",
    why: "Researchers build up sets of related entries across multiple search sessions. Collections let you organize them without re-searching.",
    usecase: "A student gathering references for a paper saves 12 protein entries across 3 search sessions, then exports them all as a single CSV.",
    example: "Star 4HHB + 2OCJ + 1TUP → Collection: 'p53 structures for essay'",
    tip: "Collections can be renamed, exported as CSV or FASTA, and re-fetched to get fresh data. Find them under the ⭐ icon in the header."
  },

  "copy-id": {
    icon: "⧉",
    title: "Copy Accession ID",
    what: "Copies the database accession number to your clipboard in one click — no selecting text needed.",
    why: "Accession IDs are the universal reference currency in biology. You'll paste them into papers, BLAST searches, and lab notes constantly.",
    usecase: "A researcher copies P04637 from a UniProt result and pastes it directly into their manuscript reference section.",
    example: "P04637 · NM_007294.4 · 4HHB — ready to paste anywhere",
    tip: "The button shows ✓ for 2 seconds after copying so you know it worked. Works for all three database ID formats."
  },

  // ── DETAIL PANEL ─────────────────────────
  "detail-overview": {
    icon: "📋",
    title: "Overview Tab",
    what: "Shows the plain-English summary of an entry: what the protein does, what organism it comes from, its key facts, and its classification.",
    why: "Raw database annotations are written for machines. This tab translates them into something a student can read and cite.",
    usecase: "A first-year biology student clicks on the p53 entry and reads 'A tumor suppressor that regulates the cell cycle and prevents uncontrolled cell division' — in plain language.",
    example: "Function · Organism · Length · Mass · Status · Taxonomy breadcrumb",
    tip: "Click any term in the taxonomy breadcrumb (e.g. 'Mammalia') to search for all entries from that group."
  },

  "detail-sequence": {
    icon: "🧬",
    title: "Sequence Tab",
    what: "Displays the full nucleotide or amino acid sequence in a formatted, readable viewer with line numbers every 10 residues.",
    why: "Raw sequences are hard to read. The viewer adds structure, highlights key regions, and lets you copy or download in standard formats.",
    usecase: "A researcher studying a protein active site uses the sequence viewer to locate the catalytic residues highlighted in red.",
    example: "10        20        30\nMEEPQSDPSV EPPLSQETFS DLWKLLPENN",
    tip: "Click 'Download FASTA' to save the sequence in the standard format used by BLAST, Clustal, and AlphaFold."
  },

  "detail-crossrefs": {
    icon: "🔗",
    title: "Cross-References Tab",
    what: "Shows the same biological entity as it appears in the other two databases — linking a UniProt protein to its PDB structures, or a GenBank gene to its protein product.",
    why: "Biological data is split across databases by type. Cross-references connect the dots without manual searching.",
    usecase: "A student viewing the UniProt entry for p53 sees 3 linked PDB structures — they click one to jump straight to the 3D crystal structure.",
    example: "UniProt P04637 → PDB: 1TUP, 2OCJ, 4HHB · GenBank: NM_000546",
    tip: "Not all entries have cross-references. A protein with no PDB link hasn't had its structure solved yet — which is itself useful information."
  },

  // ── POWER FEATURES ────────────────────────
  "batch-search": {
    icon: "📋",
    title: "Batch Search",
    what: "Lets you paste a list of IDs (one per line) and fetch all of them at once, showing results as a sortable table.",
    why: "Researchers routinely work with lists of 10–500 IDs from papers, spreadsheets, or other tools. Searching one-by-one is not practical.",
    usecase: "A bioinformatician pastes 50 UniProt IDs from a proteomics experiment, fetches all in seconds, and exports the results as a CSV.",
    example: "P04637\nP53_HUMAN\nQ8WXF1\n4HHB\nNM_007294",
    tip: "Mix ID types freely — Spurt Search detects each type automatically. Progress is shown as 'Fetching 12/50...' so you know it's working."
  },

  "export-csv": {
    icon: "📊",
    title: "Export as CSV",
    what: "Downloads all current results (or your saved collection) as a comma-separated values file, openable in Excel or Google Sheets.",
    why: "Researchers need to analyze, sort, and annotate data outside the browser. CSV is the universal format for this.",
    usecase: "A student exports 30 protein search results to CSV and opens it in Excel to build a comparison table for their dissertation.",
    example: "ID, Name, Organism, Length, Status, Database, Date → spreadsheet rows",
    tip: "The CSV includes all visible fields. If you've applied filters, only filtered results are exported — not the full unfiltered set."
  },

  "export-fasta": {
    icon: "🧬",
    title: "Export as FASTA",
    what: "Downloads sequences in FASTA format — the standard plain-text format used by nearly every bioinformatics tool.",
    why: "FASTA is the input format for BLAST, multiple sequence alignment (Clustal, MUSCLE), and structure prediction (AlphaFold, RoseTTAFold).",
    usecase: "A researcher exports 5 homologous protein sequences as a single FASTA file, then uploads it to Clustal Omega for multiple alignment.",
    example: ">P04637 Cellular tumor antigen p53 [Homo sapiens]\nMEEPQSDPSVEPPLSQETFSDLWKLLPENN...",
    tip: "FASTA files from PDB entries contain all chains. If you only need chain A, open the file in a text editor and delete the other chains."
  },

  "deep-link": {
    icon: "🔗",
    title: "Shareable Search Link",
    what: "Every search automatically updates the URL in your browser, creating a link that reproduces the exact same search and filters when opened.",
    why: "Researchers collaborate. A shareable link lets you send a colleague exactly what you're looking at — no re-doing the search.",
    usecase: "A PhD supervisor sends a student the URL of a filtered search: all reviewed human kinases from 2020–2026. Student opens the exact same view instantly.",
    example: "spurt-search.vercel.app/?q=kinase&db=uniprot&organism=human&reviewed=true",
    tip: "Copy the URL from your browser address bar at any time. Bookmarking it saves the search permanently in your browser."
  },

  "search-history": {
    icon: "🕐",
    title: "Search History",
    what: "Records your recent searches locally in your browser so you can jump back to previous queries without retyping.",
    why: "Research is iterative. You'll search, go down a path, come back, and try a variation. History makes this frictionless.",
    usecase: "A student working on a project over several days clicks their history to re-run last week's search for 'p53 Homo sapiens reviewed'.",
    example: "Recent: BRCA2 · p53 human · 4HHB · insulin mouse · NM_007294",
    tip: "History is stored only in your browser — it never leaves your device. Use 'Clear history' if you're on a shared computer."
  },

  "keyboard-palette": {
    icon: "⌨",
    title: "Command Palette",
    what: "A keyboard-driven command menu (press / or Ctrl+K) that lets you run any action in the app without using your mouse.",
    why: "Power users and researchers can work 3–5× faster with keyboard-only navigation. The palette exposes every feature instantly.",
    usecase: "A researcher mid-analysis presses Ctrl+K, types 'export fasta', presses Enter — the file downloads without touching the mouse.",
    example: "/ or Ctrl+K → type 'filter organism human' · 'export csv' · 'toggle compact' · 'clear history'",
    tip: "Type any part of a command — 'comp' matches 'compact view', 'col' matches 'my collection'. Press Escape to close without doing anything."
  },

  "compare-mode": {
    icon: "⚖",
    title: "Compare Mode",
    what: "Select 2–4 result cards using their checkboxes, then press Compare to see them side-by-side in a table, with differences highlighted.",
    why: "Choosing between similar proteins or structures requires direct comparison. Toggling back and forth between tabs is error-prone and slow.",
    usecase: "A researcher compares three PDB structures of the same protein to choose the best one for molecular docking — resolution, method, and chain count side-by-side.",
    example: "Select: 1TUP + 2OCJ + 4HHB → Compare → table shows resolution, date, method, chains, ligands",
    tip: "Differences between entries are highlighted in yellow. Identical values are shown in grey so your eye goes straight to what matters."
  },

  "onboarding-tour": {
    icon: "🎓",
    title: "Guided Tour",
    what: "A short 4-step walkthrough that introduces the main features of Spurt Search — shown once on your first visit.",
    why: "Biological databases are intimidating. A quick tour helps new students find their footing without reading documentation.",
    usecase: "A first-year biology student opens Spurt Search for the first time and follows the tour to run their first successful gene search in under 2 minutes.",
    example: "Step 1: Search bar → Step 2: Database badges → Step 3: Result cards → Step 4: Save to collection",
    tip: "Missed something? Restart the tour anytime from ⚙ Settings → 'Restart guided tour'."
  }
};
