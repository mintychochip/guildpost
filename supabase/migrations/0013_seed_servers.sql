-- Seed servers: Top PvP/Practice servers for initial database population
INSERT INTO servers (name, ip, port, version, tags, verified, vote_count)
VALUES
  ('Hypixel', 'mc.hypixel.net', 25565, '1.8-1.21', ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars'], true, 15420),
  ('PikaNetwork', 'top.pika.host', 25565, '1.21', ARRAY['Cracked', 'Practice', 'PvP', 'NoDebuff'], true, 8320),
  ('ViperMC', 'play.vipermc.net', 25565, '1.8', ARRAY['HCF', 'Hardcore', 'PvP', 'Factions'], true, 5840),
  ('JartexNetwork', 'top.jartex.fun', 25565, '1.21', ARRAY['Cracked', 'KitPvP', 'PvP', 'Practice'], true, 4120),
  ('Purple Prison', 'purpleprison.org', 25565, '1.21', ARRAY['Prison', 'PvP', 'HCF', 'Ranks'], true, 3900),
  ('PvPLand', 'play.pvpland.net', 25565, '1.21', ARRAY['Practice', 'Lifesteal', 'PvP', 'NoDebuff'], true, 2200),
  ('MeowMC', 'pvp.meowmc.fun', 25565, '1.21', ARRAY['Practice', 'Cracked', 'PvP', 'Combo'], true, 2100),
  ('TalonMC', 'play.talonmc.net', 25565, '1.21', ARRAY['Survival', 'PvP', 'Practice', '1.21'], true, 1850),
  ('MushMC', 'play.mushmc.org', 25565, '1.21', ARRAY['Practice', 'PvP', 'Combo', 'Sumo'], true, 1750),
  ('CosmicPS', 'play.cosmicps.org', 25565, '1.20', ARRAY['Skyblock', 'PvP', 'Survival', 'Practice'], true, 980);
