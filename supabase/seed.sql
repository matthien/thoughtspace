-- Dummy rows for building canvas rendering before Letterboxd sync is wired up.
-- x/y are pixel coordinates on the virtual mat canvas (card top-left corner).

insert into media_entries
  (source, source_id, media_type, title, year, director, cover_url, rating, review_text, logged_at, external_url, x, y)
values
  ('dummy', '1', 'movie', 'Paris, Texas', 1984, 'Wim Wenders', 'https://placehold.co/280x420/2a3440/f2f0e9?text=Paris%2C+Texas', 5, 'Slow, sunburnt, and it wrecked me a little. That Ry Cooder score is doing half the work and it is doing it perfectly.', '2026-06-02 20:15:00', 'https://letterboxd.com/film/paris-texas/', 220, 160),
  ('dummy', '2', 'movie', 'The Long Goodbye', 1973, 'Robert Altman', 'https://placehold.co/280x420/3a2b28/f2f0e9?text=The+Long+Goodbye', 4, 'Gould mumbles his way through a version of Marlowe that should not work and somehow is the best one.', '2026-06-05 21:40:00', 'https://letterboxd.com/film/the-long-goodbye/', 520, 210),
  ('dummy', '3', 'movie', 'Perfect Days', 2023, 'Wim Wenders', 'https://placehold.co/280x420/26302a/f2f0e9?text=Perfect+Days', 5, 'A whole philosophy of contentment told through a guy who cleans toilets and loves cassette tapes.', '2026-06-10 19:05:00', 'https://letterboxd.com/film/perfect-days/', 860, 140),
  ('dummy', '4', 'movie', 'Blow Out', 1981, 'Brian De Palma', 'https://placehold.co/280x420/342a36/f2f0e9?text=Blow+Out', 4, 'Travolta with a boom mic and a conspiracy. The ending is bleaker than it has any right to be.', '2026-06-14 22:30:00', 'https://letterboxd.com/film/blow-out/', 1180, 200),
  ('dummy', '5', 'movie', 'Housekeeping', 1987, 'Bill Forsyth', 'https://placehold.co/280x420/30302a/f2f0e9?text=Housekeeping', 4, 'Gentle and a little eerie. Two sisters, one aunt, and a house slowly losing its grip on normalcy.', '2026-06-18 18:50:00', 'https://letterboxd.com/film/housekeeping/', 260, 480),
  ('dummy', '6', 'movie', 'Le Cercle Rouge', 1970, 'Jean-Pierre Melville', 'https://placehold.co/280x420/222c38/f2f0e9?text=Le+Cercle+Rouge', 5, 'Cold, exact, and stylish in a way that makes most modern heist films look loud and embarrassed.', '2026-06-22 20:00:00', 'https://letterboxd.com/film/le-cercle-rouge/', 600, 520),
  ('dummy', '7', 'movie', 'Wendy and Lucy', 2008, 'Kelly Reichardt', 'https://placehold.co/280x420/2a3440/f2f0e9?text=Wendy+and+Lucy', 4, 'Small in scale and enormous in how much it made me worry about a dog for eighty minutes.', '2026-06-27 17:15:00', 'https://letterboxd.com/film/wendy-and-lucy/', 940, 500),
  ('dummy', '8', 'movie', 'Tampopo', 1985, 'Juzo Itami', 'https://placehold.co/280x420/3a2b28/f2f0e9?text=Tampopo', 5, 'A ramen western. Funny, horny, and hungry-making in equal measure.', '2026-07-01 21:00:00', 'https://letterboxd.com/film/tampopo/', 1260, 460);
