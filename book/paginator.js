/*
=========================================
 The Shadow Princess
 Paginator Engine
-----------------------------------------

 PURPOSE:
 This module is responsible for turning
 raw chapter text into "book pages".

 CORE RULES IT MUST ENFORCE:

 1. NO word splitting
    - Words must never be broken across lines

 2. PAGE FLOW ORDER:
    - ALWAYS fill LEFT page (Side A) first
    - THEN RIGHT page (Side B)
    - NEVER start a chapter on the right page

 3. CHAPTER START RULE:
    - Chapter Number + Title ONLY appear on LEFT page

 4. RIGHT PAGE RULE:
    - No chapter header ever appears on Side B

 5. OVERFLOW RULE:
    - If text does not fit remaining space:
        → push whole word to next page

 6. IMAGE OVERRIDE RULE:
    - If a page is assigned an image:
        → it replaces ALL text on that page

 OUTPUT STRUCTURE (future use):

 [
   { side: "A", type: "chapter-start", content: ... },
   { side: "B", type: "text", content: ... },
   ...
 ]

 THIS FILE DOES NOT:
 - render anything
 - load files
 - play animations

 It ONLY calculates page layout.
=========================================
*/
