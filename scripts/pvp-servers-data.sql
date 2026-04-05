-- ============================================================
-- Auto-generated seed file for pvpserverlist
-- Generated: 2026-04-05
-- Total servers: 951
-- Source: scripts/scrape-servers.js
-- ============================================================
--
-- Usage: Execute on Supabase Postgres to populate the servers table
-- This inserts/updates servers based on IP uniqueness
--
-- ============================================================


INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'Hypixel', 
    'mc.hypixel.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'Duels']::text[], 
    false, 
    15420, 
    'Hypixel - Minigames / PvP / Bedwars server.'
  ),
  (
    'Purple Prison', 
    'purpleprison.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    5200, 
    'Purple Prison - Prison / PvP / OPPrison server.'
  ),
  (
    '2b2t', 
    '2b2t.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP', 'Survival']::text[], 
    false, 
    5200, 
    '2b2t - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'CubeCraft', 
    'play.cubecraft.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'Eggwars']::text[], 
    false, 
    4800, 
    'CubeCraft - Minigames / PvP / Bedwars server.'
  ),
  (
    'PikaNetwork', 
    'play.pika.network', 
    25565, 
    '1.8-1.21', 
    ARRAY['Practice', 'PvP', 'NoDebuff', 'KitPvP', 'Duels', 'OPPrison']::text[], 
    false, 
    4200, 
    'PikaNetwork - Practice / PvP / NoDebuff server.'
  ),
  (
    'SaicoPvP', 
    'saiocopvp.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'FFA', 'Duels']::text[], 
    false, 
    4100, 
    'SaicoPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'Archon', 
    'mc.archonhq.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Factions', 'PvP', 'HCF', 'KitPvP', 'Prison']::text[], 
    false, 
    3800, 
    'Archon - Factions / PvP / HCF server.'
  ),
  (
    'JartexNetwork', 
    'play.jartex.network', 
    25565, 
    '1.8-1.21', 
    ARRAY['Practice', 'PvP', 'KitPvP', 'Duels', 'OPPrison', 'Skyblock']::text[], 
    false, 
    3600, 
    'JartexNetwork - Practice / PvP / KitPvP server.'
  ),
  (
    'CosmicPvP', 
    'cosmicpvp.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'KitMap']::text[], 
    false, 
    3500, 
    'CosmicPvP - Factions / PvP / HCF server.'
  ),
  (
    'Complex Gaming', 
    'mc.complex.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skyblock', 'PvP', 'Factions', 'Prison']::text[], 
    false, 
    3200, 
    'Complex Gaming - Skyblock / PvP / Factions server.'
  ),
  (
    'ManaCube', 
    'play.manacube.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Survival', 'Olympus', 'Prison']::text[], 
    false, 
    3200, 
    'ManaCube - Minigames / PvP / Survival server.'
  ),
  (
    'ViperMC', 
    'play.vipermc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'KitMap']::text[], 
    false, 
    2800, 
    'ViperMC - HCF / PvP / Factions server.'
  ),
  (
    'OPBlocks', 
    'play.opblocks.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'Skyblock']::text[], 
    false, 
    2800, 
    'OPBlocks - Prison / PvP / Skyblock server.'
  ),
  (
    'Mineplex', 
    'us.mineplex.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Clans']::text[], 
    false, 
    2800, 
    'Mineplex - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'FadeCloud', 
    'play.fadecloud.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    2800, 
    'FadeCloud - HCF / PvP / Factions server.'
  ),
  (
    'PokeFind', 
    'play.pokefind.co', 
    25565, 
    '1.8-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    2500, 
    'PokeFind - Pixelmon / PvP / Survival server.'
  ),
  (
    'Performium', 
    'play.performium.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels', 'Skywars']::text[], 
    false, 
    2200, 
    'Performium - PvP / Practice / KitPvP server.'
  ),
  (
    'Minemen Club', 
    'minemen.club', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels', 'Ranked', 'FFA']::text[], 
    false, 
    2200, 
    'Minemen Club - PvP / Practice / KitPvP server.'
  ),
  (
    'PvPLand', 
    'play.pvpland.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels', 'BoxPvP']::text[], 
    false, 
    1800, 
    'PvPLand - PvP / Practice / KitPvP server.'
  ),
  (
    'MineVille', 
    'play.mineville.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'Prison']::text[], 
    false, 
    1800, 
    'MineVille - Minigames / PvP / Bedwars server.'
  ),
  (
    'Kohi', 
    'play.kohi.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    1800, 
    'Kohi - HCF / PvP / Factions server.'
  ),
  (
    'EarthMC', 
    'play.earthmc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    1800, 
    'EarthMC - Survival / PvP / SMP server.'
  ),
  (
    'Herobrine.org', 
    'herobrine.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'Bedwars']::text[], 
    false, 
    1600, 
    'Herobrine.org - Minigames / PvP / Skywars server.'
  ),
  (
    'SMPEarth', 
    'play.smpearth.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    1600, 
    'SMPEarth - Survival / PvP / SMP server.'
  ),
  (
    'EasyMC', 
    'play.easymc.io', 
    25565, 
    '1.8-1.21', 
    ARRAY['Cracked', 'Skywars', 'Bedwars', 'PvP']::text[], 
    false, 
    1500, 
    'EasyMC - Cracked / Skywars / Bedwars server.'
  ),
  (
    'MineSuperior', 
    'play.minesuperior.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    1400, 
    'MineSuperior - Prison / PvP / OPPrison server.'
  ),
  (
    'TatsuMC', 
    'play.tatsumc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Hardcore']::text[], 
    false, 
    1400, 
    'TatsuMC - HCF / PvP / Hardcore server.'
  ),
  (
    'MushMC', 
    'play.mushmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Practice', 'PvP', 'Combo', 'Sumo', 'Duels']::text[], 
    false, 
    1400, 
    'MushMC - Practice / PvP / Combo server.'
  ),
  (
    'MineHQ', 
    'play.minehq.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'Factions', 'KitPvP']::text[], 
    false, 
    1200, 
    'MineHQ - Prison / PvP / Factions server.'
  ),
  (
    'Lifesteal SMP', 
    'play.lifestealmp.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'SMP', 'PvP', 'Survival']::text[], 
    false, 
    1200, 
    'Lifesteal SMP - Lifesteal / SMP / PvP server.'
  ),
  (
    'PokeTwo', 
    'play.poketwo.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    1200, 
    'PokeTwo - Pixelmon / PvP / Survival server.'
  ),
  (
    'SnapCraft', 
    'play.snapcraft.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'Skyblock', 'Creative', 'Minigames']::text[], 
    false, 
    1200, 
    'SnapCraft - Survival / PvP / Skyblock server.'
  ),
  (
    'HyperLands', 
    'play.hyperlands.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'Bedwars', 'PvP', 'Minigames']::text[], 
    false, 
    1100, 
    'HyperLands - Skywars / Bedwars / PvP server.'
  ),
  (
    'MeowMC', 
    'play.meowmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Practice', 'PvP', 'Combo', 'Duels', 'NoDebuff']::text[], 
    false, 
    950, 
    'MeowMC - Practice / PvP / Combo server.'
  ),
  (
    'Zonix', 
    'play.zonixmc.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    900, 
    'Zonix - HCF / PvP / Factions server.'
  ),
  (
    'RiseMC', 
    'play.risemc.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'FFA']::text[], 
    false, 
    900, 
    'RiseMC - PvP / Practice / KitPvP server.'
  ),
  (
    '9b9t', 
    '9b9t.org', 
    25565, 
    '1.16', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP']::text[], 
    false, 
    900, 
    '9b9t - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'CrystalPvP', 
    'crystalpvp.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    900, 
    'CrystalPvP - CrystalPvP / PvP / Duels server.'
  ),
  (
    'UHC Network', 
    'play.uhcnetwork.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    900, 
    'UHC Network - UHC / PvP / Survival server.'
  ),
  (
    'PokeNation', 
    'play.pokenation.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    822, 
    'PokeNation - Pixelmon / PvP / Survival server.'
  ),
  (
    'TalonMC', 
    'play.talonmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Practice', 'PvP', 'Duels', 'BoxPvP']::text[], 
    false, 
    820, 
    'TalonMC - Practice / PvP / Duels server.'
  ),
  (
    'Bedwars Practice', 
    'play.bedwarspractice.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Practice', 'Solo']::text[], 
    false, 
    820, 
    'Bedwars Practice - Bedwars / PvP / Practice server.'
  ),
  (
    'Blockdrop', 
    'play.blockdrop.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Skywars']::text[], 
    false, 
    800, 
    'Blockdrop - Bedwars / PvP / Minigames server.'
  ),
  (
    'Oldfag', 
    'oldfag.org', 
    25565, 
    '1.12', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP']::text[], 
    false, 
    800, 
    'Oldfag - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'LifestealMC', 
    'play.lifestealmc.xyz', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'Survival', 'SMP']::text[], 
    false, 
    800, 
    'LifestealMC - Lifesteal / PvP / Survival server.'
  ),
  (
    'Origin Realms', 
    'play.originrealms.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'RPG', 'Custom']::text[], 
    false, 
    800, 
    'Origin Realms - Survival / PvP / RPG server.'
  ),
  (
    'AnarchyElite', 
    'anarchyelite.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    795, 
    'AnarchyElite - Anarchy / PvP server.'
  ),
  (
    'PixelmonHub', 
    'play.pixelmonhub.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    790, 
    'PixelmonHub - Pixelmon / PvP / Survival server.'
  ),
  (
    'AnarchyRage', 
    'anarchyrage.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    785, 
    'AnarchyRage - Anarchy / PvP / Survival server.'
  ),
  (
    'PvPWars', 
    'play.pvpwars.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'FFA']::text[], 
    false, 
    750, 
    'PvPWars - PvP / Practice / KitPvP server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'PokeWorld', 
    'play.pokeworld.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    746, 
    'PokeWorld - Pixelmon / PvP / Survival server.'
  ),
  (
    'NovaPvP', 
    'play.novapvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'Duels', 'BoxPvP']::text[], 
    false, 
    720, 
    'NovaPvP - PvP / Practice / Duels server.'
  ),
  (
    'PixelmonBattle', 
    'play.pixelmonbattle.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    711, 
    'PixelmonBattle - Pixelmon / PvP / Survival server.'
  ),
  (
    'Astereal', 
    'play.astereal.com', 
    25565, 
    '1.8', 
    ARRAY['Practice', 'PvP', 'Duels', 'NoDebuff']::text[], 
    false, 
    700, 
    'Astereal - Practice / PvP / Duels server.'
  ),
  (
    'PokePlus', 
    'play.pokeplus.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    695, 
    'PokePlus - Pixelmon / PvP / Survival server.'
  ),
  (
    'BedWarsShadow', 
    'play.bedwarsshadow.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    693, 
    'BedWarsShadow - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedWarsGalaxy', 
    'play.bedwarsgalaxy.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    691, 
    'BedWarsGalaxy - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedWarsFlame', 
    'play.bedwarsflame.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    687, 
    'BedWarsFlame - Bedwars / PvP / Minigames server.'
  ),
  (
    'GymCraft', 
    'play.gymcraft.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    686, 
    'GymCraft - Pixelmon / PvP / Survival server.'
  ),
  (
    'PokePro', 
    'play.pokepro.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    684, 
    'PokePro - Pixelmon / PvP / Survival server.'
  ),
  (
    'PvP Legacy', 
    'play.pvplegacy.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    680, 
    'PvP Legacy - PvP / Practice / KitPvP server.'
  ),
  (
    'BuildUHC MC', 
    'play.builduhc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'BuildUHC', 'Duels']::text[], 
    false, 
    680, 
    'BuildUHC MC - UHC / PvP / BuildUHC server.'
  ),
  (
    'MineHero', 
    'play.minehero.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Prison']::text[], 
    false, 
    680, 
    'MineHero - Skyblock / PvP / Survival server.'
  ),
  (
    'KingdomMC', 
    'play.kingdommc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Factions', 'PvP', 'Kingdoms', 'RPG']::text[], 
    false, 
    680, 
    'KingdomMC - Factions / PvP / Kingdoms server.'
  ),
  (
    'BedWarsFire', 
    'play.bedwarsfire.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    679, 
    'BedWarsFire - Bedwars / PvP / Minigames server.'
  ),
  (
    'PokeVerse', 
    'play.pokeverse.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    675, 
    'PokeVerse - Pixelmon / PvP / Survival server.'
  ),
  (
    'BedRush', 
    'play.bedrush.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    667, 
    'BedRush - Bedwars / PvP / Minigames server.'
  ),
  (
    'PixelMC', 
    'play.pixelmc.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    667, 
    'PixelMC - Pixelmon / PvP / Survival server.'
  ),
  (
    'LifestealEmpire', 
    'play.lifestealempire.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    663, 
    'LifestealEmpire - Lifesteal / PvP / SMP server.'
  ),
  (
    'BedWarsUltimate', 
    'play.bedwarsultimate.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    661, 
    'BedWarsUltimate - Bedwars / PvP / Minigames server.'
  ),
  (
    'LifestealVoid', 
    'play.lifestealvoid.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    651, 
    'LifestealVoid - Lifesteal / PvP / SMP server.'
  ),
  (
    'PixelmonWorld', 
    'play.pixelmonworld.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    651, 
    'PixelmonWorld - Pixelmon / PvP / Survival server.'
  ),
  (
    'AnarchyMC', 
    'play.anarchymc.net', 
    25565, 
    '1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Anarchy']::text[], 
    false, 
    650, 
    'AnarchyMC - CrystalPvP / PvP / Anarchy server.'
  ),
  (
    'PvPWars', 
    'play.pvpwars.me', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'FFA']::text[], 
    false, 
    650, 
    'PvPWars - PvP / Practice / KitPvP server.'
  ),
  (
    'LifestealPro', 
    'play.lifestealpro.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    647, 
    'LifestealPro - Lifesteal / PvP / SMP server.'
  ),
  (
    'AnarchyEmpire', 
    'anarchyempire.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    641, 
    'AnarchyEmpire - Anarchy / PvP / Survival server.'
  ),
  (
    'LifestealShadow', 
    'play.lifestealshadow.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    628, 
    'LifestealShadow - Lifesteal / PvP / SMP server.'
  ),
  (
    'BedWarsX', 
    'play.bedwarsx.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    623, 
    'BedWarsX - Bedwars / PvP / Minigames server.'
  ),
  (
    'FFA MC', 
    'play.ffamc.net', 
    25565, 
    '1.8', 
    ARRAY['FFA', 'PvP', 'KitPvP', 'Practice']::text[], 
    false, 
    620, 
    'FFA MC - FFA / PvP / KitPvP server.'
  ),
  (
    'LegacyMC', 
    'play.legacymc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars']::text[], 
    false, 
    620, 
    'LegacyMC - Minigames / PvP / Bedwars server.'
  ),
  (
    'PokeBattle', 
    'play.pokebattle.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    619, 
    'PokeBattle - Pixelmon / PvP / Survival server.'
  ),
  (
    'LifestealNova', 
    'play.lifestealnova.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    618, 
    'LifestealNova - Lifesteal / PvP / SMP server.'
  ),
  (
    'PokeHub', 
    'play.pokehub.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    618, 
    'PokeHub - Pixelmon / PvP / Survival server.'
  ),
  (
    'Lifesteal World', 
    'play.lifestealworld.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    615, 
    'Lifesteal World - Lifesteal / PvP / SMP server.'
  ),
  (
    'LifestealTitan', 
    'play.lifestealtitan.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    612, 
    'LifestealTitan - Lifesteal / PvP / SMP server.'
  ),
  (
    'BedCraft', 
    'play.bedcraft.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    605, 
    'BedCraft - Bedwars / PvP / Minigames server.'
  ),
  (
    'PokeCraft', 
    'play.pokecraft.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    602, 
    'PokeCraft - Pixelmon / PvP / Survival server.'
  ),
  (
    'LifestealStorm', 
    'play.lifestealstorm.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    601, 
    'LifestealStorm - Lifesteal / PvP / SMP server.'
  ),
  (
    'ImpactMC', 
    'play.impactmc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Economy']::text[], 
    false, 
    600, 
    'ImpactMC - Factions / PvP / HCF server.'
  ),
  (
    'VortexFactions', 
    'play.vortexfactions.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    600, 
    'VortexFactions - Factions / PvP / HCF server.'
  ),
  (
    'FluxMC', 
    'play.fluxmc.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels', 'Ranked']::text[], 
    false, 
    600, 
    'FluxMC - PvP / Practice / KitPvP server.'
  ),
  (
    'Constantiam', 
    'constantiam.net', 
    25565, 
    '1.16', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP']::text[], 
    false, 
    600, 
    'Constantiam - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'HeartSteal', 
    'play.heartsteal.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'Survival']::text[], 
    false, 
    600, 
    'HeartSteal - Lifesteal / PvP / Survival server.'
  ),
  (
    'CivMC', 
    'play.civmc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'Political', 'Factions', 'Nation']::text[], 
    false, 
    600, 
    'CivMC - Survival / PvP / Political server.'
  ),
  (
    'ThiefMC', 
    'play.thiefmc.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    597, 
    'ThiefMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'AnarchyHavoc', 
    'anarchyhavoc.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    593, 
    'AnarchyHavoc - Anarchy / PvP / Survival server.'
  ),
  (
    'PixelmonCraft', 
    'play.pixelmoncraft.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    593, 
    'PixelmonCraft - Pixelmon / PvP / Survival server.'
  ),
  (
    'LifestealNetwork', 
    'play.lifestealnetwork.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    586, 
    'LifestealNetwork - Lifesteal / PvP / SMP server.'
  ),
  (
    'MinePrison', 
    'play.mineprison.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    586, 
    'MinePrison - Prison / PvP / OPPrison server.'
  ),
  (
    'EscapeMC', 
    'play.escapemc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    584, 
    'EscapeMC - Prison / PvP / OPPrison server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'BedWarsNova', 
    'play.bedwarsnova.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    580, 
    'BedWarsNova - Bedwars / PvP / Minigames server.'
  ),
  (
    'PrisonDuke', 
    'play.prisonduke.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    575, 
    'PrisonDuke - Prison / PvP / OPPrison server.'
  ),
  (
    'LifestealConquest', 
    'play.lifestealconquest.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    574, 
    'LifestealConquest - Lifesteal / PvP / SMP server.'
  ),
  (
    'BedFamine', 
    'play.bedfamine.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    571, 
    'BedFamine - Bedwars / PvP / Minigames server.'
  ),
  (
    'Bedwars Hub', 
    'play.bedwarshub.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    567, 
    'Bedwars Hub - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedWarsTitan', 
    'play.bedwarstitan.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    567, 
    'BedWarsTitan - Bedwars / PvP / Minigames server.'
  ),
  (
    'DiamondPvP', 
    'play.diamondpvp.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    560, 
    'DiamondPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'UHC Central', 
    'play.uhccentral.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    560, 
    'UHC Central - UHC / PvP / Survival server.'
  ),
  (
    'ChallengeMC', 
    'play.challengemc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'FFA', 'BuildBattle', 'Parkour']::text[], 
    false, 
    560, 
    'ChallengeMC - Minigames / PvP / FFA server.'
  ),
  (
    'HeartKingdom', 
    'play.heartkingdom.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    559, 
    'HeartKingdom - Lifesteal / PvP / SMP server.'
  ),
  (
    'PrisonPlus', 
    'play.prisonplus.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    558, 
    'PrisonPlus - Prison / PvP / OPPrison server.'
  ),
  (
    'OPPrisonMC', 
    'play.opprisonmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    555, 
    'OPPrisonMC - Prison / PvP / OPPrison server.'
  ),
  (
    'PrisonWorld', 
    'play.prisonworld.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    552, 
    'PrisonWorld - Prison / PvP / OPPrison server.'
  ),
  (
    'WardenMC', 
    'play.wardenmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    552, 
    'WardenMC - Prison / PvP / OPPrison server.'
  ),
  (
    'HCFSurge', 
    'play.hcfsurge.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid', 'Economy']::text[], 
    false, 
    549, 
    'HCFSurge - Factions / PvP / HCF server.'
  ),
  (
    'PrisonNetwork', 
    'play.prisonnetwork.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    548, 
    'PrisonNetwork - Prison / PvP / OPPrison server.'
  ),
  (
    'BlockGames', 
    'play.blockgames.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'BuildBattle', 'Parkour', 'Bedwars']::text[], 
    false, 
    547, 
    'BlockGames - Minigames / PvP / BuildBattle server.'
  ),
  (
    'HCFBlaze', 
    'play.hcfblaze.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    546, 
    'HCFBlaze - Factions / PvP / HCF server.'
  ),
  (
    'VoltageMC', 
    'play.voltagemc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    545, 
    'VoltageMC - PvP / Practice / KitPvP server.'
  ),
  (
    'SkywarsGalaxy', 
    'play.skywarsgalaxy.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    545, 
    'SkywarsGalaxy - Skywars / PvP / Minigames server.'
  ),
  (
    'RaidBattle', 
    'raidbattle.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    545, 
    'RaidBattle - Anarchy / PvP / Survival server.'
  ),
  (
    'AnarchyLegends', 
    'anarchylegends.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    541, 
    'AnarchyLegends - Anarchy / PvP server.'
  ),
  (
    'AnarchyFree', 
    'anarchyfree.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    541, 
    'AnarchyFree - Anarchy / PvP / Survival server.'
  ),
  (
    'Bedwars Central', 
    'play.bedwarscentral.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames']::text[], 
    false, 
    540, 
    'Bedwars Central - Bedwars / PvP / Minigames server.'
  ),
  (
    'EmpireMC', 
    'play.empiremc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Factions', 'PvP', 'Kingdoms', 'RPG']::text[], 
    false, 
    540, 
    'EmpireMC - Factions / PvP / Kingdoms server.'
  ),
  (
    'HCFVoid', 
    'play.hcfvoid.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    540, 
    'HCFVoid - Factions / PvP / HCF server.'
  ),
  (
    'FightCraft', 
    'pvp.fightcraft..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    538, 
    'FightCraft - PvP / Practice / KitPvP server.'
  ),
  (
    'SMPWars', 
    'play.smpwars.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    537, 
    'SMPWars - Survival / PvP / SMP server.'
  ),
  (
    'LifestealCrystal', 
    'play.lifestealcrystal.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    535, 
    'LifestealCrystal - Lifesteal / PvP / SMP server.'
  ),
  (
    'FactionsElite', 
    'play.factionselite.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    535, 
    'FactionsElite - Factions / PvP / HCF server.'
  ),
  (
    'BedWarsPro', 
    'play.bedwarspro.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    533, 
    'BedWarsPro - Bedwars / PvP / Minigames server.'
  ),
  (
    'PrisonBaron', 
    'play.prisonbaron.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    532, 
    'PrisonBaron - Prison / PvP / OPPrison server.'
  ),
  (
    'HeroMC', 
    'play.heromc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Kingdoms', 'Custom']::text[], 
    false, 
    531, 
    'HeroMC - RPG / PvP / Classes server.'
  ),
  (
    'SavageSMP', 
    'play.savagesmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    530, 
    'SavageSMP - Survival / PvP / SMP server.'
  ),
  (
    'PokeKingdom', 
    'play.pokekingdom.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    529, 
    'PokeKingdom - Pixelmon / PvP / Survival server.'
  ),
  (
    'FunMC', 
    'play.funmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    528, 
    'FunMC - Minigames / PvP / Duels server.'
  ),
  (
    'HCFX', 
    'play.hcfx.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    528, 
    'HCFX - Factions / PvP / HCF server.'
  ),
  (
    'VanguardMC', 
    'mc.vanguardmc.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid']::text[], 
    false, 
    527, 
    'VanguardMC - HCF / PvP / Factions server.'
  ),
  (
    'PrisonJail', 
    'play.prisonjail.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    526, 
    'PrisonJail - Prison / PvP / OPPrison server.'
  ),
  (
    'NomadMC', 
    'play.nomadmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    525, 
    'NomadMC - Survival / PvP / SMP server.'
  ),
  (
    'PulseMC', 
    'pvp.pulsemc..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    524, 
    'PulseMC - PvP / Practice / KitPvP server.'
  ),
  (
    'UHCDomination', 
    'play.uhcdomination.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    522, 
    'UHCDomination - UHC / PvP / Survival server.'
  ),
  (
    'AstraMC', 
    'play.astramc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    520, 
    'AstraMC - Factions / PvP / HCF server.'
  ),
  (
    'ProPvP', 
    'play.propvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'Duels', 'Ranked']::text[], 
    false, 
    520, 
    'ProPvP - PvP / Practice / Duels server.'
  ),
  (
    'BlitzMC', 
    'play.blitzmc.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'Skywars']::text[], 
    false, 
    520, 
    'BlitzMC - PvP / Practice / Skywars server.'
  ),
  (
    'LunarMC', 
    'play.lunarmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Practice', 'PvP', 'CrystalPvP', 'Duels']::text[], 
    false, 
    520, 
    'LunarMC - Practice / PvP / CrystalPvP server.'
  ),
  (
    'CrystalMC', 
    'play.crystalmc.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    520, 
    'CrystalMC - CrystalPvP / PvP / Duels server.'
  ),
  (
    'Aternia', 
    'play.aternia.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    520, 
    'Aternia - Survival / PvP / SMP server.'
  ),
  (
    'HeartMC', 
    'play.heartmc.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    519, 
    'HeartMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'EssenceMC', 
    'play.essencemc.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    519, 
    'EssenceMC - Lifesteal / PvP / SMP server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'EssencePvP', 
    'play.essencepvp.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    518, 
    'EssencePvP - Lifesteal / PvP / SMP server.'
  ),
  (
    'JoyMC', 
    'play.joymc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'BuildBattle', 'Parkour', 'Bedwars']::text[], 
    false, 
    517, 
    'JoyMC - Minigames / PvP / BuildBattle server.'
  ),
  (
    'AnarchyDestruction', 
    'anarchydestruction.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    515, 
    'AnarchyDestruction - Anarchy / PvP / Survival server.'
  ),
  (
    'TestMC', 
    'play.testmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Parkour', 'Bedwars', 'Skywars']::text[], 
    false, 
    513, 
    'TestMC - Minigames / PvP / Parkour server.'
  ),
  (
    'AnarchyHub', 
    'anarchyhub.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    512, 
    'AnarchyHub - Anarchy / PvP server.'
  ),
  (
    'BloodMC', 
    'play.bloodmc.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    512, 
    'BloodMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'SkyWarsDragon', 
    'play.skywarsdragon.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    511, 
    'SkyWarsDragon - Skywars / PvP / Minigames server.'
  ),
  (
    'UHCLegends', 
    'play.uhclegends.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    510, 
    'UHCLegends - UHC / PvP / Survival server.'
  ),
  (
    'LifestealBlaze', 
    'play.lifestealblaze.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    509, 
    'LifestealBlaze - Lifesteal / PvP / SMP server.'
  ),
  (
    'HeartWars', 
    'play.heartwars.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    508, 
    'HeartWars - Lifesteal / PvP / SMP server.'
  ),
  (
    'FactionsRealm', 
    'play.factionsrealm.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    508, 
    'FactionsRealm - Factions / PvP / HCF server.'
  ),
  (
    'SMPWorld', 
    'play.smpworld.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla']::text[], 
    false, 
    507, 
    'SMPWorld - Survival / PvP / SMP server.'
  ),
  (
    'BedWarsRoyale', 
    'play.bedwarsroyale.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    506, 
    'BedWarsRoyale - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedWarsArena', 
    'play.bedwarsarena.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    506, 
    'BedWarsArena - Bedwars / PvP / Minigames server.'
  ),
  (
    'PrisonLegends', 
    'play.prisonlegends.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    505, 
    'PrisonLegends - Prison / PvP / OPPrison server.'
  ),
  (
    'SoulMC', 
    'play.soulmc.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    504, 
    'SoulMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'LifeStealNetwork', 
    'play.lifestealnetwork.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    502, 
    'LifeStealNetwork - Lifesteal / PvP / SMP server.'
  ),
  (
    'OrdealMC', 
    'play.ordealmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    501, 
    'OrdealMC - Minigames / PvP / Skywars server.'
  ),
  (
    'UHCLeague', 
    'play.uhcleague.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    498, 
    'UHCLeague - UHC / PvP / Survival server.'
  ),
  (
    'HCFReaper', 
    'play.hcfreaper.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore']::text[], 
    false, 
    498, 
    'HCFReaper - Factions / PvP / HCF server.'
  ),
  (
    'UHCConquest', 
    'play.uhcconquest.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    497, 
    'UHCConquest - UHC / PvP / Survival server.'
  ),
  (
    'SMPElite', 
    'play.smpelite.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla']::text[], 
    false, 
    497, 
    'SMPElite - Survival / PvP / SMP server.'
  ),
  (
    'RaidWars', 
    'raidwars.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP']::text[], 
    false, 
    497, 
    'RaidWars - Anarchy / PvP / Survival server.'
  ),
  (
    'UHCBattle', 
    'play.uhcbattle.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    496, 
    'UHCBattle - UHC / PvP / Survival server.'
  ),
  (
    'AnarchyRaid', 
    'anarchyraid.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    496, 
    'AnarchyRaid - Anarchy / PvP / Survival server.'
  ),
  (
    'AllegianceMC', 
    'play.allegiancemc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    494, 
    'AllegianceMC - HCF / PvP / Factions server.'
  ),
  (
    'HCFHub', 
    'play.hcfhub.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    494, 
    'HCFHub - HCF / PvP / Factions server.'
  ),
  (
    'SettlerMC', 
    'play.settlermc.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny', 'Factions']::text[], 
    false, 
    494, 
    'SettlerMC - Survival / PvP / SMP server.'
  ),
  (
    'FrontlineMC', 
    'hcf.frontlinemc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    493, 
    'FrontlineMC - HCF / PvP / Factions server.'
  ),
  (
    'RogueMC', 
    'play.roguemc.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    492, 
    'RogueMC - RPG / PvP / Custom server.'
  ),
  (
    'PokeNetwork', 
    'play.pokenetwork.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    492, 
    'PokeNetwork - Pixelmon / PvP / Survival server.'
  ),
  (
    'FactionsNetwork', 
    'play.factionsnetwork.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore', 'Raid']::text[], 
    false, 
    492, 
    'FactionsNetwork - Factions / PvP / HCF server.'
  ),
  (
    'MiniGameHub', 
    'play.minigamehub.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    491, 
    'MiniGameHub - Minigames / PvP / Bedwars server.'
  ),
  (
    'StealHearts', 
    'play.stealhearts.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    491, 
    'StealHearts - Lifesteal / PvP / SMP server.'
  ),
  (
    'PillageWars', 
    'pillagewars.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    491, 
    'PillageWars - Anarchy / PvP / Survival server.'
  ),
  (
    'BedWarsBlaze', 
    'play.bedwarsblaze.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    489, 
    'BedWarsBlaze - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedWarsLegends', 
    'play.bedwarslegends.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    488, 
    'BedWarsLegends - Bedwars / PvP / Minigames server.'
  ),
  (
    'SkyWarsTitan', 
    'play.skywarstitan.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    487, 
    'SkyWarsTitan - Skywars / PvP / Minigames server.'
  ),
  (
    'LifeStealX', 
    'play.lifestealx.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    486, 
    'LifeStealX - Lifesteal / PvP / SMP server.'
  ),
  (
    'UHCLegacy', 
    'play.uhclegacy.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    485, 
    'UHCLegacy - UHC / PvP / Survival server.'
  ),
  (
    'RelentlessMC', 
    'play.relentlessmc.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    485, 
    'RelentlessMC - Survival / PvP / SMP server.'
  ),
  (
    'SoulPvP', 
    'play.soulpvp.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    485, 
    'SoulPvP - Lifesteal / PvP / SMP server.'
  ),
  (
    'WastelandSurvival', 
    'wastelandsurvival.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    485, 
    'WastelandSurvival - Anarchy / PvP / Survival server.'
  ),
  (
    'BanditMC', 
    'play.banditmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    484, 
    'BanditMC - Survival / PvP / SMP server.'
  ),
  (
    'PokeLegends', 
    'play.pokelegends.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    484, 
    'PokeLegends - Pixelmon / PvP / Survival server.'
  ),
  (
    'BattleBox', 
    'play.battlebox.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    480, 
    'BattleBox - PvP / Practice / KitPvP server.'
  ),
  (
    'PvPWars UHC', 
    'uhc.pvpwars.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Competitive']::text[], 
    false, 
    480, 
    'PvPWars UHC - UHC / PvP / Competitive server.'
  ),
  (
    'ReviveMC', 
    'play.revivemc.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    480, 
    'ReviveMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'NoDebuffMC', 
    'play.nodebuffmc.com', 
    25565, 
    '1.8', 
    ARRAY['NoDebuff', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    480, 
    'NoDebuffMC - NoDebuff / PvP / Duels server.'
  ),
  (
    'ApexPvP', 
    'play.apexpvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'Duels', 'Ranked']::text[], 
    false, 
    480, 
    'ApexPvP - PvP / Practice / Duels server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'OdysseyMC', 
    'play.odysseymc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'RPG', 'Custom']::text[], 
    false, 
    480, 
    'OdysseyMC - Survival / PvP / RPG server.'
  ),
  (
    'InmateMC', 
    'play.inmatemc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    480, 
    'InmateMC - Prison / PvP / OPPrison server.'
  ),
  (
    'HCFTempest', 
    'play.hcftempest.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore']::text[], 
    false, 
    480, 
    'HCFTempest - Factions / PvP / HCF server.'
  ),
  (
    'FactionsHub', 
    'play.factionshub.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore', 'Economy']::text[], 
    false, 
    480, 
    'FactionsHub - Factions / PvP / HCF server.'
  ),
  (
    'ApocalypseBattle', 
    'apocalypsebattle.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP', 'Raid']::text[], 
    false, 
    480, 
    'ApocalypseBattle - Anarchy / PvP / Survival server.'
  ),
  (
    'LifestealRealm', 
    'play.lifestealrealm.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    476, 
    'LifestealRealm - Lifesteal / PvP / SMP server.'
  ),
  (
    'MinigameWorld', 
    'play.minigameworld.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    476, 
    'MinigameWorld - Minigames / PvP / Skywars server.'
  ),
  (
    'HCFEclipse', 
    'play.hcfeclipse.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid', 'Hardcore']::text[], 
    false, 
    475, 
    'HCFEclipse - HCF / PvP / Factions server.'
  ),
  (
    'PokeElite', 
    'play.pokeelite.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    474, 
    'PokeElite - Pixelmon / PvP / Survival server.'
  ),
  (
    'ApocalypsePvP', 
    'apocalypsepvp.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    474, 
    'ApocalypsePvP - Anarchy / PvP / Survival server.'
  ),
  (
    'AnarchyChaos', 
    'anarchychaos.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    472, 
    'AnarchyChaos - Anarchy / PvP server.'
  ),
  (
    'HCFFrost', 
    'play.hcffrost.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid']::text[], 
    false, 
    472, 
    'HCFFrost - Factions / PvP / HCF server.'
  ),
  (
    'EggWarsWorld', 
    'play.eggwarsworld.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    471, 
    'EggWarsWorld - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'SMPLegends', 
    'play.smplegends.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    469, 
    'SMPLegends - Survival / PvP / SMP server.'
  ),
  (
    'PioneerSMP', 
    'play.pioneersmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    469, 
    'PioneerSMP - Survival / PvP / SMP server.'
  ),
  (
    'KeepMC', 
    'hcf.keepmc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    468, 
    'KeepMC - HCF / PvP / Factions server.'
  ),
  (
    'MCPrison', 
    'play.mcprison.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    468, 
    'MCPrison - Prison / PvP / OPPrison server.'
  ),
  (
    'SurvivalWars', 
    'play.survivalwars.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    467, 
    'SurvivalWars - Survival / PvP / SMP server.'
  ),
  (
    'ArcadeMC', 
    'play.arcademc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    467, 
    'ArcadeMC - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'KnightMC', 
    'play.knightmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Classes', 'Custom']::text[], 
    false, 
    465, 
    'KnightMC - RPG / PvP / Factions server.'
  ),
  (
    'TNTWars', 
    'play.tntwars.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'FFA', 'BuildBattle', 'Parkour']::text[], 
    false, 
    465, 
    'TNTWars - Minigames / PvP / FFA server.'
  ),
  (
    'FlashMC', 
    'play.flashmc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    464, 
    'FlashMC - PvP / Practice / KitPvP server.'
  ),
  (
    'SkyBattle', 
    'play.skybattle.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    464, 
    'SkyBattle - Skyblock / PvP / Survival server.'
  ),
  (
    'IgnitePvP', 
    'pvp.ignitepvp..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    462, 
    'IgnitePvP - PvP / Practice / KitPvP server.'
  ),
  (
    'UHCHub', 
    'play.uhchub.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    462, 
    'UHCHub - UHC / PvP / Survival server.'
  ),
  (
    'WarriorRealm', 
    'play.warriorrealm.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Kingdoms', 'Custom']::text[], 
    false, 
    462, 
    'WarriorRealm - RPG / PvP / Classes server.'
  ),
  (
    'FortressMC', 
    'hcf.fortressmc.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    461, 
    'FortressMC - HCF / PvP / Factions server.'
  ),
  (
    'UHCVictory', 
    'play.uhcvictory.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    461, 
    'UHCVictory - UHC / PvP / Survival server.'
  ),
  (
    'RPGNetwork', 
    'play.rpgnetwork.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes', 'Factions']::text[], 
    false, 
    461, 
    'RPGNetwork - RPG / PvP / Custom server.'
  ),
  (
    'ComboMC', 
    'play.combomc.net', 
    25565, 
    '1.8', 
    ARRAY['Combo', 'PvP', 'Practice', 'Duels']::text[], 
    false, 
    460, 
    'ComboMC - Combo / PvP / Practice server.'
  ),
  (
    'SkywarsMaster', 
    'play.skywarsmaster.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    460, 
    'SkywarsMaster - Skywars / PvP / Minigames server.'
  ),
  (
    'HCF Network', 
    'mc.hcfnetwork.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    458, 
    'HCF Network - HCF / PvP / Factions server.'
  ),
  (
    'FactionsBattle', 
    'play.factionsbattle.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid']::text[], 
    false, 
    458, 
    'FactionsBattle - Factions / PvP / HCF server.'
  ),
  (
    'ChampionMC', 
    'pvp.championmc..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    457, 
    'ChampionMC - PvP / Practice / KitPvP server.'
  ),
  (
    'HCFRealm', 
    'play.hcfrealm.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid', 'Hardcore']::text[], 
    false, 
    457, 
    'HCFRealm - HCF / PvP / Factions server.'
  ),
  (
    'UHCTriumph', 
    'play.uhctriumph.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    457, 
    'UHCTriumph - UHC / PvP / Survival server.'
  ),
  (
    'AnarchyShadow', 
    'anarchyshadow.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    457, 
    'AnarchyShadow - Anarchy / PvP server.'
  ),
  (
    'PokemonCraft', 
    'play.pokemoncraft.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    456, 
    'PokemonCraft - Pixelmon / PvP / Survival server.'
  ),
  (
    'SkywarsArena', 
    'play.skywarsarena.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    455, 
    'SkywarsArena - Skywars / PvP / Minigames server.'
  ),
  (
    'UHCWarfare', 
    'play.uhcwarfare.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    454, 
    'UHCWarfare - UHC / PvP / Survival server.'
  ),
  (
    'LifeStealers', 
    'play.lifestealers.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    454, 
    'LifeStealers - Lifesteal / PvP / SMP server.'
  ),
  (
    'PrisonMax', 
    'play.prisonmax.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    453, 
    'PrisonMax - Prison / PvP / OPPrison server.'
  ),
  (
    'OPPrisonOmega', 
    'play.opprisonomega.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    453, 
    'OPPrisonOmega - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyLoot', 
    'anarchyloot.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    452, 
    'AnarchyLoot - Anarchy / PvP / Survival server.'
  ),
  (
    'ApocalypseWars', 
    'apocalypsewars.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    452, 
    'ApocalypseWars - Anarchy / PvP / Survival server.'
  ),
  (
    'FactionWars', 
    'play.factionwars.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    450, 
    'FactionWars - Factions / PvP / HCF server.'
  ),
  (
    'AbyssMC', 
    'play.abyssmc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Anarchy']::text[], 
    false, 
    450, 
    'AbyssMC - HCF / PvP / Factions server.'
  ),
  (
    'VoxelMC', 
    'play.voxelmc.net', 
    25565, 
    '1.8', 
    ARRAY['Practice', 'PvP', 'Duels', 'NoDebuff', 'Debuff']::text[], 
    false, 
    450, 
    'VoxelMC - Practice / PvP / Duels server.'
  ),
  (
    'VortexMC', 
    'play.vortexmc.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP']::text[], 
    false, 
    450, 
    'VortexMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'WildCraft', 
    'play.wildcraft.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Wilderness']::text[], 
    false, 
    450, 
    'WildCraft - Survival / PvP / SMP server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'ViperMC Network', 
    'play.vipermcnetwork.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'Skywars', 'PvP']::text[], 
    false, 
    450, 
    'ViperMC Network - Bedwars / Skywars / PvP server.'
  ),
  (
    'AnarchyMayhem', 
    'anarchymayhem.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP', 'Survival']::text[], 
    false, 
    450, 
    'AnarchyMayhem - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'PixelmonArena', 
    'play.pixelmonarena.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    450, 
    'PixelmonArena - Pixelmon / PvP / Survival server.'
  ),
  (
    'SkyWarsPvP', 
    'play.skywarspvp.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    448, 
    'SkyWarsPvP - Skyblock / PvP / Survival server.'
  ),
  (
    'StrikePvP', 
    'mc.strikepvp..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    447, 
    'StrikePvP - PvP / Practice / KitPvP server.'
  ),
  (
    'HCFReaper', 
    'play.hcfreaper.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    447, 
    'HCFReaper - HCF / PvP / Factions server.'
  ),
  (
    'FunZoneMC', 
    'play.funzonemc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'FFA', 'BuildBattle', 'Parkour']::text[], 
    false, 
    447, 
    'FunZoneMC - Minigames / PvP / FFA server.'
  ),
  (
    'PvPGamma', 
    'play.pvpgamma.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    446, 
    'PvPGamma - PvP / Practice / BuildUHC server.'
  ),
  (
    'BedwarsBlaze', 
    'play.bedwarsblaze.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    446, 
    'BedwarsBlaze - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedwarsStronghold', 
    'play.bedwarsstronghold.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Doubles']::text[], 
    false, 
    446, 
    'BedwarsStronghold - Bedwars / PvP / Minigames server.'
  ),
  (
    'SlayerMC', 
    'mc.slayermc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    445, 
    'SlayerMC - PvP / Practice / KitPvP server.'
  ),
  (
    'UHCRealm', 
    'play.uhcrealm.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    445, 
    'UHCRealm - UHC / PvP / Survival server.'
  ),
  (
    'PokeEmpire', 
    'play.pokeempire.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    445, 
    'PokeEmpire - Pixelmon / PvP / Survival server.'
  ),
  (
    'AnarchyState', 
    'anarchystate.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP']::text[], 
    false, 
    444, 
    'AnarchyState - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'ApocalypseSurvival', 
    'apocalypsesurvival.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    444, 
    'ApocalypseSurvival - Anarchy / PvP / Survival server.'
  ),
  (
    'RPGLegends', 
    'play.rpglegends.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    444, 
    'RPGLegends - RPG / PvP / Custom server.'
  ),
  (
    'HCFFlame', 
    'play.hcfflame.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    443, 
    'HCFFlame - Factions / PvP / HCF server.'
  ),
  (
    'ParkourMC', 
    'play.parkourmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'FFA', 'BuildBattle', 'Parkour']::text[], 
    false, 
    443, 
    'ParkourMC - Minigames / PvP / FFA server.'
  ),
  (
    'SoulWars', 
    'play.soulwars.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    442, 
    'SoulWars - Lifesteal / PvP / SMP server.'
  ),
  (
    'EggWarsNetwork', 
    'play.eggwarsnetwork.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    442, 
    'EggWarsNetwork - Minigames / PvP / Skywars server.'
  ),
  (
    'BedwarsFrost', 
    'play.bedwarsfrost.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Doubles']::text[], 
    false, 
    442, 
    'BedwarsFrost - Bedwars / PvP / Minigames server.'
  ),
  (
    'PvPOmega', 
    'play.pvpomega.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    441, 
    'PvPOmega - PvP / Practice / KitPvP server.'
  ),
  (
    'AnarchyX', 
    'anarchyx.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP', 'Raid']::text[], 
    false, 
    441, 
    'AnarchyX - Anarchy / PvP / Survival server.'
  ),
  (
    'EclipseMC', 
    'play.eclipsemc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Practice', 'PvP', 'Duels', 'CrystalPvP']::text[], 
    false, 
    440, 
    'EclipseMC - Practice / PvP / Duels server.'
  ),
  (
    'SkyblockPvP', 
    'play.skyblockpvp.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    440, 
    'SkyblockPvP - Skyblock / PvP / Survival server.'
  ),
  (
    'IslandPvP', 
    'play.islandpvp.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    440, 
    'IslandPvP - Skyblock / PvP / Survival server.'
  ),
  (
    'FactionsWars', 
    'play.factionswars.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore']::text[], 
    false, 
    439, 
    'FactionsWars - Factions / PvP / HCF server.'
  ),
  (
    'AnarchyChaos', 
    'anarchychaos.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    439, 
    'AnarchyChaos - Anarchy / PvP / Survival server.'
  ),
  (
    'PokeArena', 
    'play.pokearena.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    438, 
    'PokeArena - Pixelmon / PvP / Survival server.'
  ),
  (
    'PvPCentral', 
    'pvp.pvpcentral..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    437, 
    'PvPCentral - PvP / Practice / KitPvP server.'
  ),
  (
    'TempoMC', 
    'mc.tempomc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    437, 
    'TempoMC - PvP / Practice / KitPvP server.'
  ),
  (
    'CellMC', 
    'play.cellmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    437, 
    'CellMC - Prison / PvP / OPPrison server.'
  ),
  (
    'HCFChaos', 
    'play.hcfchaos.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    437, 
    'HCFChaos - Factions / PvP / HCF server.'
  ),
  (
    'BedwarsFire', 
    'play.bedwarsfire.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    437, 
    'BedwarsFire - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedwarsMadness', 
    'play.bedwarsmadness.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    437, 
    'BedwarsMadness - Bedwars / PvP / Minigames server.'
  ),
  (
    'VanillaUHC', 
    'play.vanillauhc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    436, 
    'VanillaUHC - UHC / PvP / Survival server.'
  ),
  (
    'HCFPlus', 
    'play.hcfplus.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore', 'Raid', 'Economy']::text[], 
    false, 
    436, 
    'HCFPlus - Factions / PvP / HCF server.'
  ),
  (
    'UHCEmpire', 
    'play.uhcempire.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    435, 
    'UHCEmpire - UHC / PvP / Survival server.'
  ),
  (
    'PureMC', 
    'play.puremc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    435, 
    'PureMC - Survival / PvP / SMP server.'
  ),
  (
    'VitalityMC', 
    'play.vitalitymc.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    435, 
    'VitalityMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'BedWarsElite', 
    'play.bedwarselite.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    434, 
    'BedWarsElite - Bedwars / PvP / Minigames server.'
  ),
  (
    'LifestealHub', 
    'play.lifestealhub.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    433, 
    'LifestealHub - Lifesteal / PvP / SMP server.'
  ),
  (
    'PvPAlpha', 
    'play.pvpalpha.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    433, 
    'PvPAlpha - PvP / Practice / BuildUHC server.'
  ),
  (
    'WarriorMC', 
    'mc.warriormc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    432, 
    'WarriorMC - PvP / Practice / KitPvP server.'
  ),
  (
    'CloudWars', 
    'play.cloudwars.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    432, 
    'CloudWars - Skywars / PvP / Minigames server.'
  ),
  (
    'MythicMC', 
    'play.mythicmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Kingdoms', 'Custom']::text[], 
    false, 
    432, 
    'MythicMC - RPG / PvP / Classes server.'
  ),
  (
    'DiamondPvP', 
    'play.diamondpvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    430, 
    'DiamondPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'NetherWars', 
    'play.netherwars.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    430, 
    'NetherWars - Bedwars / PvP / Minigames server.'
  ),
  (
    'BloodConquest', 
    'play.bloodconquest.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    428, 
    'BloodConquest - Lifesteal / PvP / SMP server.'
  ),
  (
    'FFAEmpire', 
    'play.ffaempire.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    428, 
    'FFAEmpire - PvP / Practice / KitPvP server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'ShockMC', 
    'play.shockmc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    427, 
    'ShockMC - PvP / Practice / KitPvP server.'
  ),
  (
    'LifestealElite', 
    'play.lifestealelite.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    427, 
    'LifestealElite - Lifesteal / PvP / SMP server.'
  ),
  (
    'SMPConquest', 
    'play.smpconquest.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    427, 
    'SMPConquest - Survival / PvP / SMP server.'
  ),
  (
    'AnarchyPlus', 
    'anarchyplus.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP', 'Survival']::text[], 
    false, 
    427, 
    'AnarchyPlus - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'AnarchyRuin', 
    'anarchyruin.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    424, 
    'AnarchyRuin - Anarchy / PvP server.'
  ),
  (
    'AnchorMC', 
    'play.anchormc.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    423, 
    'AnchorMC - CrystalPvP / PvP / Duels server.'
  ),
  (
    'ClanMC', 
    'hcf.clanmc.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid']::text[], 
    false, 
    422, 
    'ClanMC - HCF / PvP / Factions server.'
  ),
  (
    'QuestPvP', 
    'play.questpvp.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Custom']::text[], 
    false, 
    422, 
    'QuestPvP - RPG / PvP / Classes server.'
  ),
  (
    'SiegeSMP', 
    'play.siegesmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    422, 
    'SiegeSMP - Survival / PvP / SMP server.'
  ),
  (
    'KitPvPPro', 
    'play.kitpvppro.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    421, 
    'KitPvPPro - PvP / Practice / BuildUHC server.'
  ),
  (
    'PrimeMC', 
    'play.primemc.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    420, 
    'PrimeMC - Factions / PvP / HCF server.'
  ),
  (
    'FrostMC', 
    'play.frostmc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    420, 
    'FrostMC - Factions / PvP / HCF server.'
  ),
  (
    'InfinityMC', 
    'play.infinitymc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    420, 
    'InfinityMC - Factions / PvP / HCF server.'
  ),
  (
    'VeltPvP', 
    'play.veltpvp.com', 
    25565, 
    '1.8', 
    ARRAY['SurvivalGames', 'PvP', 'Minigames', 'Duels']::text[], 
    false, 
    420, 
    'VeltPvP - SurvivalGames / PvP / Minigames server.'
  ),
  (
    'BlazeMC', 
    'play.blazemc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['PvP', 'Practice', 'CrystalPvP', 'Duels']::text[], 
    false, 
    420, 
    'BlazeMC - PvP / Practice / CrystalPvP server.'
  ),
  (
    'DuelCraft', 
    'play.duelcraft.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Duels', 'Practice', 'CrystalPvP']::text[], 
    false, 
    420, 
    'DuelCraft - PvP / Duels / Practice server.'
  ),
  (
    'Sumo MC', 
    'play.sumomc.net', 
    25565, 
    '1.8', 
    ARRAY['Sumo', 'PvP', 'Practice', 'Duels']::text[], 
    false, 
    420, 
    'Sumo MC - Sumo / PvP / Practice server.'
  ),
  (
    'EnderMC', 
    'play.endermc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    420, 
    'EnderMC - Skyblock / PvP / Survival server.'
  ),
  (
    'CelestialMC', 
    'play.celestialmc.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Custom']::text[], 
    false, 
    420, 
    'CelestialMC - Skyblock / PvP / Custom server.'
  ),
  (
    'TwilightMC', 
    'play.twilightmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Survival', 'PvP', 'RPG', 'Custom']::text[], 
    false, 
    420, 
    'TwilightMC - Survival / PvP / RPG server.'
  ),
  (
    'GoldenMC', 
    'play.goldenmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars']::text[], 
    false, 
    420, 
    'GoldenMC - Minigames / PvP / Skywars server.'
  ),
  (
    'WastelandMC', 
    'play.wastelandmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'Anarchy', 'SMP']::text[], 
    false, 
    420, 
    'WastelandMC - Survival / PvP / Anarchy server.'
  ),
  (
    'ConquestMC', 
    'play.conquestmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Factions', 'PvP', 'Conquest', 'RPG']::text[], 
    false, 
    420, 
    'ConquestMC - Factions / PvP / Conquest server.'
  ),
  (
    'DuelPro', 
    'play.duelpro.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    420, 
    'DuelPro - PvP / Practice / BuildUHC server.'
  ),
  (
    'TerritoryMC', 
    'hcf.territorymc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'KitMap']::text[], 
    false, 
    419, 
    'TerritoryMC - HCF / PvP / Factions server.'
  ),
  (
    'MCPrisonPro', 
    'play.mcprisonpro.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    419, 
    'MCPrisonPro - Prison / PvP / OPPrison server.'
  ),
  (
    'RaidedMC', 
    'raidedmc.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    419, 
    'RaidedMC - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPHavoc', 
    'play.crystalpvphavoc.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    419, 
    'CrystalPvPHavoc - CrystalPvP / PvP / Duels server.'
  ),
  (
    'RealmPvP', 
    'play.realmpvp.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Classes', 'Custom']::text[], 
    false, 
    417, 
    'RealmPvP - RPG / PvP / Factions server.'
  ),
  (
    'SkyblockRaid', 
    'play.skyblockraid.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    417, 
    'SkyblockRaid - Skyblock / PvP / Survival server.'
  ),
  (
    'PrisonGamma', 
    'play.prisongamma.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    417, 
    'PrisonGamma - Prison / PvP / OPPrison server.'
  ),
  (
    'LootPvP', 
    'lootpvp.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    417, 
    'LootPvP - Anarchy / PvP / Survival server.'
  ),
  (
    'MageBattle', 
    'play.magebattle.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes']::text[], 
    false, 
    417, 
    'MageBattle - RPG / PvP / Custom server.'
  ),
  (
    'SurvivalPvP', 
    'play.survivalpvp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny', 'Vanilla', 'Factions']::text[], 
    false, 
    416, 
    'SurvivalPvP - Survival / PvP / SMP server.'
  ),
  (
    'SkyblockWars', 
    'play.skyblockwars.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    416, 
    'SkyblockWars - Skyblock / PvP / Survival server.'
  ),
  (
    'HCFOlympus', 
    'hcf.hcfolympus.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid']::text[], 
    false, 
    415, 
    'HCFOlympus - HCF / PvP / Factions server.'
  ),
  (
    'BrutalSMP', 
    'play.brutalsmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla', 'Factions']::text[], 
    false, 
    415, 
    'BrutalSMP - Survival / PvP / SMP server.'
  ),
  (
    'UHCBattles', 
    'play.uhcbattles.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    414, 
    'UHCBattles - UHC / PvP / Survival server.'
  ),
  (
    'KitPvPHub', 
    'play.kitpvphub.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    414, 
    'KitPvPHub - PvP / Practice / NoDebuff server.'
  ),
  (
    'HardcoreSMP', 
    'play.hardcoresmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny', 'Factions']::text[], 
    false, 
    414, 
    'HardcoreSMP - Survival / PvP / SMP server.'
  ),
  (
    'SkyWarsVoid', 
    'play.skywarsvoid.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    413, 
    'SkyWarsVoid - Skywars / PvP / Minigames server.'
  ),
  (
    'PrisonMadness', 
    'play.prisonmadness.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    413, 
    'PrisonMadness - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyHardcore', 
    'anarchyhardcore.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    411, 
    'AnarchyHardcore - Anarchy / PvP / Survival server.'
  ),
  (
    'HardcoreUHC', 
    'play.hardcoreuhc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Hardcore', 'Survival']::text[], 
    false, 
    410, 
    'HardcoreUHC - UHC / PvP / Hardcore server.'
  ),
  (
    'TitanMC', 
    'play.titanmc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    410, 
    'TitanMC - HCF / PvP / Factions server.'
  ),
  (
    'SkywarsPro', 
    'play.skywarspro.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    410, 
    'SkywarsPro - Skywars / PvP / Minigames server.'
  ),
  (
    'DoomsdaySurvival', 
    'doomsdaysurvival.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    410, 
    'DoomsdaySurvival - Anarchy / PvP / Survival server.'
  ),
  (
    'SurgeMC', 
    'mc.surgemc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    409, 
    'SurgeMC - PvP / Practice / KitPvP server.'
  ),
  (
    'TrialMC', 
    'play.trialmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'BuildBattle', 'Parkour', 'Bedwars']::text[], 
    false, 
    407, 
    'TrialMC - Minigames / PvP / BuildBattle server.'
  ),
  (
    'BedwarsSpeed', 
    'play.bedwarsspeed.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    407, 
    'BedwarsSpeed - Bedwars / PvP / Minigames server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'WandererMC', 
    'play.wanderermc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla']::text[], 
    false, 
    406, 
    'WandererMC - Survival / PvP / SMP server.'
  ),
  (
    'GottaCatchMC', 
    'play.gottacatchmc.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    406, 
    'GottaCatchMC - Pixelmon / PvP / Survival server.'
  ),
  (
    'WastelandMC', 
    'wastelandmc.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP']::text[], 
    false, 
    405, 
    'WastelandMC - Anarchy / PvP / Survival server.'
  ),
  (
    'PixelVerse', 
    'play.pixelverse.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    404, 
    'PixelVerse - Pixelmon / PvP / Survival server.'
  ),
  (
    'AnarchyAbsolute', 
    'anarchyabsolute.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    404, 
    'AnarchyAbsolute - Anarchy / PvP / Survival server.'
  ),
  (
    'BedWarsMaster', 
    'play.bedwarsmaster.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    403, 
    'BedWarsMaster - Bedwars / PvP / Minigames server.'
  ),
  (
    'PokeConquest', 
    'play.pokeconquest.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Trainer']::text[], 
    false, 
    403, 
    'PokeConquest - Pixelmon / PvP / Survival server.'
  ),
  (
    'BedwarsPhoenix', 
    'play.bedwarsphoenix.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    403, 
    'BedwarsPhoenix - Bedwars / PvP / Minigames server.'
  ),
  (
    'WastelandPvP', 
    'wastelandpvp.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    402, 
    'WastelandPvP - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPRoyale', 
    'play.crystalpvproyale.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    401, 
    'CrystalPvPRoyale - CrystalPvP / PvP / Duels server.'
  ),
  (
    'PracticeHub', 
    'play.practicehub.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    401, 
    'PracticeHub - PvP / Practice / BuildUHC server.'
  ),
  (
    'OPPrisonExtreme', 
    'play.opprisonextreme.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    401, 
    'OPPrisonExtreme - Prison / PvP / OPPrison server.'
  ),
  (
    'ApocalypseMC', 
    'apocalypsemc.com', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP']::text[], 
    false, 
    401, 
    'ApocalypseMC - Anarchy / PvP / Survival server.'
  ),
  (
    'PvPZenith', 
    'play.pvpzenith.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    399, 
    'PvPZenith - PvP / Practice / NoDebuff server.'
  ),
  (
    'HCFZenith', 
    'mc.hcfzenith.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    398, 
    'HCFZenith - HCF / PvP / Factions server.'
  ),
  (
    'UHCWorld', 
    'play.uhcworld.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    398, 
    'UHCWorld - UHC / PvP / Survival server.'
  ),
  (
    'HCFPhantom', 
    'mc.hcfphantom.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    397, 
    'HCFPhantom - HCF / PvP / Factions server.'
  ),
  (
    'ConquestSMP', 
    'play.conquestsmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    397, 
    'ConquestSMP - Survival / PvP / SMP server.'
  ),
  (
    'LifestealPlus', 
    'play.lifestealplus.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    395, 
    'LifestealPlus - Lifesteal / PvP / SMP server.'
  ),
  (
    'FFAHub', 
    'play.ffahub.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    395, 
    'FFAHub - PvP / Practice / BuildUHC server.'
  ),
  (
    'CloudBattle', 
    'play.cloudbattle.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    395, 
    'CloudBattle - Skyblock / PvP / Survival server.'
  ),
  (
    'SorcererMC', 
    'play.sorcerermc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    395, 
    'SorcererMC - RPG / PvP / Custom server.'
  ),
  (
    'Skywars Network', 
    'play.skywarsnetwork.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    394, 
    'Skywars Network - Skywars / PvP / Minigames server.'
  ),
  (
    'CrystalPvPArena', 
    'play.crystalpvparena.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    394, 
    'CrystalPvPArena - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SurgePvP', 
    'pvp.surgepvp..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    393, 
    'SurgePvP - PvP / Practice / KitPvP server.'
  ),
  (
    'UHCForge', 
    'play.uhcforge.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    393, 
    'UHCForge - UHC / PvP / Survival server.'
  ),
  (
    'RaiderMC', 
    'play.raidermc.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla', 'Factions']::text[], 
    false, 
    393, 
    'RaiderMC - Survival / PvP / SMP server.'
  ),
  (
    'EpicMC', 
    'play.epicmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Custom']::text[], 
    false, 
    393, 
    'EpicMC - RPG / PvP / Factions server.'
  ),
  (
    'ParkourWorld', 
    'play.parkourworld.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Murder', 'Bedwars', 'Skywars']::text[], 
    false, 
    392, 
    'ParkourWorld - Minigames / PvP / Murder server.'
  ),
  (
    'SovereignMC', 
    'mc.sovereignmc.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    391, 
    'SovereignMC - HCF / PvP / Factions server.'
  ),
  (
    'OPPrisonSupreme', 
    'play.opprisonsupreme.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    391, 
    'OPPrisonSupreme - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyTrue', 
    'anarchytrue.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    391, 
    'AnarchyTrue - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPBlade', 
    'play.crystalpvpblade.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    391, 
    'CrystalPvPBlade - CrystalPvP / PvP / Duels server.'
  ),
  (
    'DuelZone', 
    'play.duelzone..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    390, 
    'DuelZone - PvP / Practice / KitPvP server.'
  ),
  (
    'BreachMC', 
    'mc.breachmc.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    390, 
    'BreachMC - HCF / PvP / Factions server.'
  ),
  (
    'SagaMC', 
    'play.sagamc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Custom']::text[], 
    false, 
    390, 
    'SagaMC - RPG / PvP / Classes server.'
  ),
  (
    'PvPEta', 
    'play.pvpeta.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    389, 
    'PvPEta - PvP / Practice / NoDebuff server.'
  ),
  (
    'HungerGamesPro', 
    'play.hungergamespro.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    389, 
    'HungerGamesPro - Minigames / PvP / KitPvP server.'
  ),
  (
    'SoulRealm', 
    'play.soulrealm.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    388, 
    'SoulRealm - Lifesteal / PvP / SMP server.'
  ),
  (
    'HCFFury', 
    'mc.hcffury.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid', 'KitMap']::text[], 
    false, 
    387, 
    'HCFFury - HCF / PvP / Factions server.'
  ),
  (
    'PvPOasis', 
    'play.pvpoasis.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    387, 
    'PvPOasis - PvP / Practice / FFA server.'
  ),
  (
    'FactionsWorld', 
    'play.factionsworld.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Economy']::text[], 
    false, 
    387, 
    'FactionsWorld - Factions / PvP / HCF server.'
  ),
  (
    'HeartSMP', 
    'play.heartsmp.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    386, 
    'HeartSMP - Lifesteal / PvP / SMP server.'
  ),
  (
    'BattleSMP', 
    'play.battlesmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny', 'Factions']::text[], 
    false, 
    386, 
    'BattleSMP - Survival / PvP / SMP server.'
  ),
  (
    'CrystalPvPHub', 
    'play.crystalpvphub.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    385, 
    'CrystalPvPHub - CrystalPvP / PvP / Duels server.'
  ),
  (
    'RogueSMP', 
    'play.roguesmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    385, 
    'RogueSMP - Survival / PvP / SMP server.'
  ),
  (
    'FFABattle', 
    'play.ffabattle.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    385, 
    'FFABattle - PvP / Practice / NoDebuff server.'
  ),
  (
    'HCFPro', 
    'mc.hcfpro.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    384, 
    'HCFPro - HCF / PvP / Factions server.'
  ),
  (
    'PrisonUltimate', 
    'play.prisonultimate.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    384, 
    'PrisonUltimate - Prison / PvP / OPPrison server.'
  ),
  (
    'PracticeElite', 
    'play.practiceelite.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    383, 
    'PracticeElite - PvP / Practice / FFA server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'RankedSMP', 
    'play.rankedsmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    383, 
    'RankedSMP - Survival / PvP / SMP server.'
  ),
  (
    'OPPrisonElite', 
    'play.opprisonelite.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    382, 
    'OPPrisonElite - Prison / PvP / OPPrison server.'
  ),
  (
    'MinigameElite', 
    'play.minigameelite.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    382, 
    'MinigameElite - Minigames / PvP / Duels server.'
  ),
  (
    'BedWarsDragon', 
    'play.bedwarsdragon.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    381, 
    'BedWarsDragon - Bedwars / PvP / Minigames server.'
  ),
  (
    'MurderMysteryMC', 
    'play.murdermysterymc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    381, 
    'MurderMysteryMC - Minigames / PvP / Skywars server.'
  ),
  (
    'BrawlMC', 
    'play.brawlmc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    380, 
    'BrawlMC - HCF / PvP / Factions server.'
  ),
  (
    'RaidingMC', 
    'play.raidingmc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'Raid']::text[], 
    false, 
    380, 
    'RaidingMC - Factions / PvP / Raid server.'
  ),
  (
    'RaidCraft', 
    'play.raidcraft.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'Raid', 'HCF']::text[], 
    false, 
    380, 
    'RaidCraft - Factions / PvP / Raid server.'
  ),
  (
    'RevivalMC', 
    'play.revivalmc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    380, 
    'RevivalMC - HCF / PvP / Factions server.'
  ),
  (
    'ObsidianMC', 
    'play.obsidianmc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    380, 
    'ObsidianMC - Factions / PvP / HCF server.'
  ),
  (
    'RaidPvP', 
    'play.raidpvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'FFA']::text[], 
    false, 
    380, 
    'RaidPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'BedBreak', 
    'play.bedbreak.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    380, 
    'BedBreak - Bedwars / PvP / Minigames server.'
  ),
  (
    'SurvivalMC', 
    'play.survivalmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'LandClaim']::text[], 
    false, 
    380, 
    'SurvivalMC - Survival / PvP / SMP server.'
  ),
  (
    'UHC MC', 
    'play.uhcmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    380, 
    'UHC MC - UHC / PvP / Survival server.'
  ),
  (
    'BridgeMC', 
    'play.bridgemc.org', 
    25565, 
    '1.8', 
    ARRAY['Bridge', 'PvP', 'Practice', 'Minigames']::text[], 
    false, 
    380, 
    'BridgeMC - Bridge / PvP / Practice server.'
  ),
  (
    'GamerMC', 
    'play.gamermc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'Bedwars']::text[], 
    false, 
    380, 
    'GamerMC - Minigames / PvP / Skywars server.'
  ),
  (
    'GalaxyMC', 
    'play.galaxymc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars']::text[], 
    false, 
    380, 
    'GalaxyMC - Minigames / PvP / Skywars server.'
  ),
  (
    'RPG PvP', 
    'play.rpgpvp.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Duels']::text[], 
    false, 
    380, 
    'RPG PvP - RPG / PvP / Classes server.'
  ),
  (
    'PvPNexus', 
    'play.pvpnexus.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    379, 
    'PvPNexus - PvP / Practice / FFA server.'
  ),
  (
    'FactionsLegends', 
    'play.factionslegends.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    379, 
    'FactionsLegends - Factions / PvP / HCF server.'
  ),
  (
    'WastelandBattle', 
    'wastelandbattle.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    379, 
    'WastelandBattle - Anarchy / PvP / Survival server.'
  ),
  (
    'MinecraftPrison', 
    'play.minecraftprison.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    378, 
    'MinecraftPrison - Prison / PvP / OPPrison server.'
  ),
  (
    'UHCRoyale', 
    'play.uhcroyale.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    377, 
    'UHCRoyale - UHC / PvP / Survival server.'
  ),
  (
    'PracticeLegends', 
    'play.practicelegends.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    377, 
    'PracticeLegends - PvP / Practice / BuildUHC server.'
  ),
  (
    'RPGWorld', 
    'play.rpgworld.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    376, 
    'RPGWorld - RPG / PvP / Custom server.'
  ),
  (
    'OPPrisonInsane', 
    'play.opprisoninsane.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    375, 
    'OPPrisonInsane - Prison / PvP / OPPrison server.'
  ),
  (
    'SMPHCF', 
    'play.smphcf.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    375, 
    'SMPHCF - Survival / PvP / SMP server.'
  ),
  (
    'SkyEmpire', 
    'play.skyempire.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    373, 
    'SkyEmpire - Skyblock / PvP / Survival server.'
  ),
  (
    'PrisonAlpha', 
    'play.prisonalpha.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    373, 
    'PrisonAlpha - Prison / PvP / OPPrison server.'
  ),
  (
    'VitalityPvP', 
    'play.vitalitypvp.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    372, 
    'VitalityPvP - Lifesteal / PvP / SMP server.'
  ),
  (
    'OPPrisonWorld', 
    'play.opprisonworld.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    372, 
    'OPPrisonWorld - Prison / PvP / OPPrison server.'
  ),
  (
    'HCFLegion', 
    'play.hcflegion.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    371, 
    'HCFLegion - HCF / PvP / Factions server.'
  ),
  (
    'HeartBattle', 
    'play.heartbattle.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    371, 
    'HeartBattle - Lifesteal / PvP / SMP server.'
  ),
  (
    'PrisonFrenzy', 
    'play.prisonfrenzy.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    371, 
    'PrisonFrenzy - Prison / PvP / OPPrison server.'
  ),
  (
    'PokeWars', 
    'play.pokewars.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    370, 
    'PokeWars - Pixelmon / PvP / Survival server.'
  ),
  (
    'DuelNetwork', 
    'play.duelnetwork.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    370, 
    'DuelNetwork - PvP / Practice / FFA server.'
  ),
  (
    'BurstMC', 
    'play.burstmc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    369, 
    'BurstMC - PvP / Practice / KitPvP server.'
  ),
  (
    'PvPForge', 
    'play.pvpforge.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    369, 
    'PvPForge - PvP / Practice / KitPvP server.'
  ),
  (
    'PracticeX', 
    'play.practicex.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    369, 
    'PracticeX - PvP / Practice / KitPvP server.'
  ),
  (
    'FlameMC', 
    'mc.flamemc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    368, 
    'FlameMC - PvP / Practice / KitPvP server.'
  ),
  (
    'BedwarsNova', 
    'play.bedwarsnova.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Doubles']::text[], 
    false, 
    368, 
    'BedwarsNova - Bedwars / PvP / Minigames server.'
  ),
  (
    'HCFInferno', 
    'play.hcfinferno.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore', 'Raid']::text[], 
    false, 
    366, 
    'HCFInferno - Factions / PvP / HCF server.'
  ),
  (
    'BattleRoyaleMC', 
    'play.battleroyalemc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    366, 
    'BattleRoyaleMC - Minigames / PvP / Duels server.'
  ),
  (
    'ExplosionPvP', 
    'play.explosionpvp.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Arena']::text[], 
    false, 
    363, 
    'ExplosionPvP - CrystalPvP / PvP / Duels server.'
  ),
  (
    'BedWarsStorm', 
    'play.bedwarsstorm.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    362, 
    'BedWarsStorm - Bedwars / PvP / Minigames server.'
  ),
  (
    'EggWarsElite', 
    'play.eggwarselite.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    362, 
    'EggWarsElite - Minigames / PvP / KitPvP server.'
  ),
  (
    'CloudRaid', 
    'play.cloudraid.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    361, 
    'CloudRaid - Skyblock / PvP / Survival server.'
  ),
  (
    'QuantumMC', 
    'play.quantummc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    360, 
    'QuantumMC - HCF / PvP / Factions server.'
  ),
  (
    'PhoenixMC', 
    'play.phoenixmc.org', 
    25565, 
    '1.8', 
    ARRAY['Practice', 'PvP', 'Duels', 'FFA']::text[], 
    false, 
    360, 
    'PhoenixMC - Practice / PvP / Duels server.'
  ),
  (
    'ThunderPvP', 
    'play.thunderpvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'FFA']::text[], 
    false, 
    360, 
    'ThunderPvP - PvP / Practice / KitPvP server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'HorizonMC', 
    'play.horizonmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    360, 
    'HorizonMC - Survival / PvP / SMP server.'
  ),
  (
    'EmeraldMC', 
    'play.emeraldmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Economy']::text[], 
    false, 
    360, 
    'EmeraldMC - Survival / PvP / SMP server.'
  ),
  (
    'SkyWarsNexus', 
    'play.skywarsnexus.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    360, 
    'SkyWarsNexus - Skywars / PvP / Minigames server.'
  ),
  (
    'PaladinMC', 
    'play.paladinmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    360, 
    'PaladinMC - RPG / PvP / Custom server.'
  ),
  (
    'HeroBattle', 
    'play.herobattle.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    360, 
    'HeroBattle - RPG / PvP / Custom server.'
  ),
  (
    'Bedwars Network', 
    'play.bedwarsnetwork.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    358, 
    'Bedwars Network - Bedwars / PvP / Minigames server.'
  ),
  (
    'FactionsDominion', 
    'play.factionsdominion.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid']::text[], 
    false, 
    357, 
    'FactionsDominion - Factions / PvP / HCF server.'
  ),
  (
    'FunWorld', 
    'play.funworld.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Parkour', 'Eggwars', 'Murder']::text[], 
    false, 
    357, 
    'FunWorld - Minigames / PvP / Parkour server.'
  ),
  (
    'BedwarsNexus', 
    'play.bedwarsnexus.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Doubles']::text[], 
    false, 
    357, 
    'BedwarsNexus - Bedwars / PvP / Minigames server.'
  ),
  (
    'CrystalPvPHub', 
    'play.crystalpvphub.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    356, 
    'CrystalPvPHub - CrystalPvP / PvP / Duels server.'
  ),
  (
    'UHCPlus', 
    'play.uhcplus.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    355, 
    'UHCPlus - UHC / PvP / Survival server.'
  ),
  (
    'AnarchyNight', 
    'anarchynight.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP', 'Survival']::text[], 
    false, 
    354, 
    'AnarchyNight - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'OPPrisonFrenzy', 
    'play.opprisonfrenzy.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    354, 
    'OPPrisonFrenzy - Prison / PvP / OPPrison server.'
  ),
  (
    'StormPvP', 
    'play.stormpvp..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    351, 
    'StormPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'ApexMC', 
    'play.apexmc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    350, 
    'ApexMC - Factions / PvP / HCF server.'
  ),
  (
    'CosmicSkywars', 
    'play.cosmicskywars.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames']::text[], 
    false, 
    350, 
    'CosmicSkywars - Skywars / PvP / Minigames server.'
  ),
  (
    'CraftPvP', 
    'play.craftpvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP']::text[], 
    false, 
    350, 
    'CraftPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'FrontierPvP', 
    'play.frontierpvp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    350, 
    'FrontierPvP - Survival / PvP / SMP server.'
  ),
  (
    'VoxelGames', 
    'play.voxelgames.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    350, 
    'VoxelGames - Minigames / PvP / Bedwars server.'
  ),
  (
    'PvPWorship', 
    'play.pvpworship..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    349, 
    'PvPWorship - PvP / Practice / KitPvP server.'
  ),
  (
    'FunPro', 
    'play.funpro.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Eggwars', 'Murder', 'Bedwars']::text[], 
    false, 
    349, 
    'FunPro - Minigames / PvP / Eggwars server.'
  ),
  (
    'CloudPvP', 
    'play.cloudpvp.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    349, 
    'CloudPvP - Skyblock / PvP / Survival server.'
  ),
  (
    'MomentumPvP', 
    'play.momentumpvp..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    348, 
    'MomentumPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'HCF Central', 
    'play.hcfcentral.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid', 'Hardcore', 'KitMap']::text[], 
    false, 
    348, 
    'HCF Central - HCF / PvP / Factions server.'
  ),
  (
    'AnarchyFury', 
    'anarchyfury.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP']::text[], 
    false, 
    348, 
    'AnarchyFury - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'BedWarsVoid', 
    'play.bedwarsvoid.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    347, 
    'BedWarsVoid - Bedwars / PvP / Minigames server.'
  ),
  (
    'SkyWarsX', 
    'play.skywarsx.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    347, 
    'SkyWarsX - Skywars / PvP / Minigames server.'
  ),
  (
    'UHCPortal', 
    'play.uhcportal.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    346, 
    'UHCPortal - UHC / PvP / Survival server.'
  ),
  (
    'MagePvPHub', 
    'play.magepvphub.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes', 'Factions']::text[], 
    false, 
    346, 
    'MagePvPHub - RPG / PvP / Custom server.'
  ),
  (
    'SkywarsLegends', 
    'play.skywarslegends.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    345, 
    'SkywarsLegends - Skywars / PvP / Minigames server.'
  ),
  (
    'OPPrisonHub', 
    'play.opprisonhub.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    345, 
    'OPPrisonHub - Prison / PvP / OPPrison server.'
  ),
  (
    'SkyBattles', 
    'play.skybattles.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    344, 
    'SkyBattles - Skywars / PvP / Minigames server.'
  ),
  (
    'LifeStealPlus', 
    'play.lifestealplus.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    344, 
    'LifeStealPlus - Lifesteal / PvP / SMP server.'
  ),
  (
    'WarzoneMC', 
    'pvp.warzonemc..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    343, 
    'WarzoneMC - PvP / Practice / KitPvP server.'
  ),
  (
    'VoltMC', 
    'pvp.voltmc..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    343, 
    'VoltMC - PvP / Practice / KitPvP server.'
  ),
  (
    'UHCElite', 
    'play.uhcelite.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    343, 
    'UHCElite - UHC / PvP / Survival server.'
  ),
  (
    'LegendMC', 
    'play.legendmc.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    343, 
    'LegendMC - RPG / PvP / Custom server.'
  ),
  (
    'RuthlessMC', 
    'play.ruthlessmc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    342, 
    'RuthlessMC - Survival / PvP / SMP server.'
  ),
  (
    'BloodPvP', 
    'play.bloodpvp.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    342, 
    'BloodPvP - Lifesteal / PvP / SMP server.'
  ),
  (
    'RhythmMC', 
    'play.rhythmmc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    341, 
    'RhythmMC - PvP / Practice / KitPvP server.'
  ),
  (
    'ArcMC', 
    'mc.arcmc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    341, 
    'ArcMC - PvP / Practice / KitPvP server.'
  ),
  (
    'ClassBattle', 
    'play.classbattle.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes', 'Factions']::text[], 
    false, 
    341, 
    'ClassBattle - RPG / PvP / Custom server.'
  ),
  (
    'NexusMC', 
    'play.nexusmc.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    340, 
    'NexusMC - Factions / PvP / HCF server.'
  ),
  (
    'ZenithMC', 
    'play.zenithmc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    340, 
    'ZenithMC - HCF / PvP / Factions server.'
  ),
  (
    'BoxPvP MC', 
    'play.boxpvp.com', 
    25565, 
    '1.8', 
    ARRAY['BoxPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    340, 
    'BoxPvP MC - BoxPvP / PvP / Duels server.'
  ),
  (
    'CraftZone', 
    'play.craftzone.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars']::text[], 
    false, 
    340, 
    'CraftZone - Minigames / PvP / Bedwars server.'
  ),
  (
    'AlphaMC', 
    'play.alphamc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    340, 
    'AlphaMC - Survival / PvP / SMP server.'
  ),
  (
    'AetherMC', 
    'play.aethermc.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival']::text[], 
    false, 
    340, 
    'AetherMC - Skyblock / PvP / Survival server.'
  ),
  (
    'WildernessMC', 
    'play.wildernessmc.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Wilderness']::text[], 
    false, 
    340, 
    'WildernessMC - Survival / PvP / SMP server.'
  ),
  (
    'BedwarsShadow', 
    'play.bedwarsshadow.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Quads']::text[], 
    false, 
    340, 
    'BedwarsShadow - Bedwars / PvP / Minigames server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'DoomsdayMC', 
    'doomsdaymc.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    340, 
    'DoomsdayMC - Anarchy / PvP / Survival server.'
  ),
  (
    'SurvivalGamesMC', 
    'play.survivalgamesmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    339, 
    'SurvivalGamesMC - Minigames / PvP / Bedwars server.'
  ),
  (
    'ArcherPvP', 
    'play.archerpvp.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    337, 
    'ArcherPvP - RPG / PvP / Custom server.'
  ),
  (
    'KingdomMC', 
    'play.kingdommc.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Custom']::text[], 
    false, 
    334, 
    'KingdomMC - RPG / PvP / Factions server.'
  ),
  (
    'BedWarsPlus', 
    'play.bedwarsplus.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    333, 
    'BedWarsPlus - Bedwars / PvP / Minigames server.'
  ),
  (
    'AnarchyVoid', 
    'anarchyvoid.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP']::text[], 
    false, 
    332, 
    'AnarchyVoid - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'PixelGames', 
    'play.pixelgames.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Parkour', 'Bedwars', 'Skywars']::text[], 
    false, 
    331, 
    'PixelGames - Minigames / PvP / Parkour server.'
  ),
  (
    'PrisonHub', 
    'play.prisonhub.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    330, 
    'PrisonHub - Prison / PvP / OPPrison server.'
  ),
  (
    'LifeDrainMC', 
    'play.lifedrainmc.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    330, 
    'LifeDrainMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'FactionsKingdom', 
    'play.factionskingdom.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid', 'Economy']::text[], 
    false, 
    330, 
    'FactionsKingdom - Factions / PvP / HCF server.'
  ),
  (
    'CompetitiveMC', 
    'play.competitivemc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    330, 
    'CompetitiveMC - Survival / PvP / SMP server.'
  ),
  (
    'PvPSurvival', 
    'play.pvpsurvival.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    330, 
    'PvPSurvival - Survival / PvP / SMP server.'
  ),
  (
    'RageMC', 
    'mc.ragemc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    329, 
    'RageMC - PvP / Practice / KitPvP server.'
  ),
  (
    'UHCPro', 
    'play.uhcpro.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    329, 
    'UHCPro - UHC / PvP / Survival server.'
  ),
  (
    'BoltPvP', 
    'pvp.boltpvp..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    327, 
    'BoltPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'CloudConquest', 
    'play.cloudconquest.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    327, 
    'CloudConquest - Skyblock / PvP / Survival server.'
  ),
  (
    'PvPSanctuary', 
    'play.pvpsanctuary.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    326, 
    'PvPSanctuary - PvP / Practice / NoDebuff server.'
  ),
  (
    'KitPvPLegends', 
    'play.kitpvplegends.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    326, 
    'KitPvPLegends - PvP / Practice / FFA server.'
  ),
  (
    'AnarchyPure', 
    'anarchypure.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    326, 
    'AnarchyPure - Anarchy / PvP / Survival server.'
  ),
  (
    'DoomsdayPvP', 
    'doomsdaypvp.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    324, 
    'DoomsdayPvP - Anarchy / PvP / Survival server.'
  ),
  (
    'IslandBattles', 
    'play.islandbattles.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    323, 
    'IslandBattles - Skyblock / PvP / Survival server.'
  ),
  (
    'CrystalWars', 
    'play.crystalwars.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Arena']::text[], 
    false, 
    321, 
    'CrystalWars - CrystalPvP / PvP / Duels server.'
  ),
  (
    'AetherWars', 
    'play.aetherwars.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    321, 
    'AetherWars - Skyblock / PvP / Survival server.'
  ),
  (
    'PvP Thunder', 
    'play.pvpthunder.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'FFA']::text[], 
    false, 
    320, 
    'PvP Thunder - PvP / Practice / KitPvP server.'
  ),
  (
    'UHC Champions', 
    'play.uhcchampions.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Competitive', 'Ranked']::text[], 
    false, 
    320, 
    'UHC Champions - UHC / PvP / Competitive server.'
  ),
  (
    'ParagonMC', 
    'play.paragonmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla']::text[], 
    false, 
    320, 
    'ParagonMC - Survival / PvP / SMP server.'
  ),
  (
    'ClassCraft', 
    'play.classcraft.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Arena']::text[], 
    false, 
    320, 
    'ClassCraft - RPG / PvP / Classes server.'
  ),
  (
    'PvPZone', 
    'mc.pvpzone..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    319, 
    'PvPZone - PvP / Practice / KitPvP server.'
  ),
  (
    'DuelLegends', 
    'play.duellegends.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    319, 
    'DuelLegends - PvP / Practice / FFA server.'
  ),
  (
    'CrystalPvPCentral', 
    'play.crystalpvpcentral.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    319, 
    'CrystalPvPCentral - CrystalPvP / PvP / Duels server.'
  ),
  (
    'HCFTitan', 
    'play.hcftitan.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    318, 
    'HCFTitan - Factions / PvP / HCF server.'
  ),
  (
    'SiegeMC', 
    'mc.siegemc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'KitMap']::text[], 
    false, 
    317, 
    'SiegeMC - HCF / PvP / Factions server.'
  ),
  (
    'PrisonCellblock', 
    'play.prisoncellblock.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    317, 
    'PrisonCellblock - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyNetwork', 
    'anarchynetwork.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    317, 
    'AnarchyNetwork - Anarchy / PvP / Survival server.'
  ),
  (
    'DuelHub', 
    'play.duelhub.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    317, 
    'DuelHub - PvP / Practice / NoDebuff server.'
  ),
  (
    'TNTRunMC', 
    'play.tntrunmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Eggwars', 'Murder', 'Bedwars']::text[], 
    false, 
    317, 
    'TNTRunMC - Minigames / PvP / Eggwars server.'
  ),
  (
    'AdventureMC', 
    'play.adventuremc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    316, 
    'AdventureMC - Minigames / PvP / Duels server.'
  ),
  (
    'KitPvPMasters', 
    'play.kitpvpmasters.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    316, 
    'KitPvPMasters - PvP / Practice / NoDebuff server.'
  ),
  (
    'RawMC', 
    'play.rawmc.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    315, 
    'RawMC - Survival / PvP / SMP server.'
  ),
  (
    'AnarchyLords', 
    'anarchylords.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP', 'Survival']::text[], 
    false, 
    315, 
    'AnarchyLords - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'HideSeek', 
    'play.hideseek.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    315, 
    'HideSeek - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'SkyConquest', 
    'play.skyconquest.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    315, 
    'SkyConquest - Skyblock / PvP / Survival server.'
  ),
  (
    'QuestMC', 
    'play.questmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    314, 
    'QuestMC - Minigames / PvP / KitPvP server.'
  ),
  (
    'HCFAbyss', 
    'play.hcfabyss.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Economy']::text[], 
    false, 
    314, 
    'HCFAbyss - Factions / PvP / HCF server.'
  ),
  (
    'DetonateMC', 
    'play.detonatemc.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    313, 
    'DetonateMC - CrystalPvP / PvP / Duels server.'
  ),
  (
    'CrystalPvPElite', 
    'play.crystalpvpelite.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    313, 
    'CrystalPvPElite - CrystalPvP / PvP / Duels server.'
  ),
  (
    'RPGHub', 
    'play.rpghub.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    313, 
    'RPGHub - RPG / PvP / Custom server.'
  ),
  (
    'CatalystPvP', 
    'mc.catalystpvp..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    312, 
    'CatalystPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'SkyFight', 
    'play.skyfight.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    312, 
    'SkyFight - Skywars / PvP / Minigames server.'
  ),
  (
    'CrystalPvPPro', 
    'play.crystalpvppro.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Arena']::text[], 
    false, 
    312, 
    'CrystalPvPPro - CrystalPvP / PvP / Duels server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'PrisonOmega', 
    'play.prisonomega.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    311, 
    'PrisonOmega - Prison / PvP / OPPrison server.'
  ),
  (
    'ZenMC', 
    'play.zenmc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    310, 
    'ZenMC - Factions / PvP / HCF server.'
  ),
  (
    'EvoMC', 
    'play.evomc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    310, 
    'EvoMC - Factions / PvP / HCF server.'
  ),
  (
    'StrikeMC', 
    'play.strikemc.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    310, 
    'StrikeMC - PvP / Practice / KitPvP server.'
  ),
  (
    'DeDuels', 
    'play.deduels.net', 
    25565, 
    '1.8', 
    ARRAY['Debuff', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    310, 
    'DeDuels - Debuff / PvP / Duels server.'
  ),
  (
    'EmberMC', 
    'play.embermc.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    310, 
    'EmberMC - PvP / Practice / KitPvP server.'
  ),
  (
    'ArcadiaMC', 
    'play.arcadiamc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    310, 
    'ArcadiaMC - Survival / PvP / SMP server.'
  ),
  (
    'FrontierSMP', 
    'play.frontiersmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    310, 
    'FrontierSMP - Survival / PvP / SMP server.'
  ),
  (
    'SkyWarsPhoenix', 
    'play.skywarsphoenix.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    309, 
    'SkyWarsPhoenix - Skywars / PvP / Minigames server.'
  ),
  (
    'CrystalPvPFury', 
    'play.crystalpvpfury.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    309, 
    'CrystalPvPFury - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SkyWarsStorm', 
    'play.skywarsstorm.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    308, 
    'SkyWarsStorm - Skywars / PvP / Minigames server.'
  ),
  (
    'FFANetwork', 
    'play.ffanetwork.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    308, 
    'FFANetwork - PvP / Practice / NoDebuff server.'
  ),
  (
    'MinigamePlus', 
    'play.minigameplus.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'BuildBattle', 'Parkour', 'Eggwars']::text[], 
    false, 
    308, 
    'MinigamePlus - Minigames / PvP / BuildBattle server.'
  ),
  (
    'MCPrisonHub', 
    'play.mcprisonhub.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    307, 
    'MCPrisonHub - Prison / PvP / OPPrison server.'
  ),
  (
    'RPGBattle', 
    'play.rpgbattle.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes']::text[], 
    false, 
    307, 
    'RPGBattle - RPG / PvP / Custom server.'
  ),
  (
    'ConvictMC', 
    'play.convictmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    306, 
    'ConvictMC - Prison / PvP / OPPrison server.'
  ),
  (
    'GladiatorMC', 
    'play.gladiatormc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    305, 
    'GladiatorMC - PvP / Practice / KitPvP server.'
  ),
  (
    'WastelandWars', 
    'wastelandwars.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    303, 
    'WastelandWars - Anarchy / PvP / Survival server.'
  ),
  (
    'BedwarsVoid', 
    'play.bedwarsvoid.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Trio']::text[], 
    false, 
    302, 
    'BedwarsVoid - Bedwars / PvP / Minigames server.'
  ),
  (
    'EmpireMC', 
    'play.empiremc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Kingdoms', 'Custom']::text[], 
    false, 
    301, 
    'EmpireMC - RPG / PvP / Classes server.'
  ),
  (
    'AnarchyNation', 
    'anarchynation.com', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    301, 
    'AnarchyNation - Anarchy / PvP / Survival server.'
  ),
  (
    'GameHub', 
    'play.gamehub.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    301, 
    'GameHub - Minigames / PvP / Bedwars server.'
  ),
  (
    'OutlawMC', 
    'play.outlawmc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    300, 
    'OutlawMC - Survival / PvP / SMP server.'
  ),
  (
    'AnarchyDark', 
    'anarchydark.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    298, 
    'AnarchyDark - Anarchy / PvP server.'
  ),
  (
    'VampireMC', 
    'play.vampiremc.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    298, 
    'VampireMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'IslandConquest', 
    'play.islandconquest.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    297, 
    'IslandConquest - Skyblock / PvP / Survival server.'
  ),
  (
    'LifestealArena', 
    'play.lifestealarena.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    296, 
    'LifestealArena - Lifesteal / PvP / SMP server.'
  ),
  (
    'CrystalPvPFrost', 
    'play.crystalpvpfrost.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Arena']::text[], 
    false, 
    295, 
    'CrystalPvPFrost - CrystalPvP / PvP / Duels server.'
  ),
  (
    'StealMC', 
    'play.stealmc.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    295, 
    'StealMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'OmegaSMP', 
    'play.omegasmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    295, 
    'OmegaSMP - Survival / PvP / SMP server.'
  ),
  (
    'InfernoMC', 
    'play.infernomc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    294, 
    'InfernoMC - PvP / Practice / KitPvP server.'
  ),
  (
    'SkyWarsBlaze', 
    'play.skywarsblaze.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    293, 
    'SkyWarsBlaze - Skywars / PvP / Minigames server.'
  ),
  (
    'CrystalPvPLegends', 
    'play.crystalpvplegends.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Arena']::text[], 
    false, 
    293, 
    'CrystalPvPLegends - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SMPPlus', 
    'play.smpplus.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    293, 
    'SMPPlus - Survival / PvP / SMP server.'
  ),
  (
    'PvPSigma', 
    'play.pvpsigma.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    293, 
    'PvPSigma - PvP / Practice / FFA server.'
  ),
  (
    'ChillPvP', 
    'play.chillpvp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    292, 
    'ChillPvP - Survival / PvP / SMP server.'
  ),
  (
    'MagePvP', 
    'play.magepvp.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    292, 
    'MagePvP - RPG / PvP / Custom server.'
  ),
  (
    'BlastMC', 
    'play.blastmc.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Arena']::text[], 
    false, 
    291, 
    'BlastMC - CrystalPvP / PvP / Duels server.'
  ),
  (
    'UltraMC', 
    'play.ultramc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    291, 
    'UltraMC - UHC / PvP / Survival server.'
  ),
  (
    'RPGElite', 
    'play.rpgelite.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    291, 
    'RPGElite - RPG / PvP / Custom server.'
  ),
  (
    'BedFamine', 
    'play.bedfamine.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames']::text[], 
    false, 
    290, 
    'BedFamine - Bedwars / PvP / Minigames server.'
  ),
  (
    'OmegaMC', 
    'play.omegamc.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP']::text[], 
    false, 
    290, 
    'OmegaMC - PvP / Practice / KitPvP server.'
  ),
  (
    'NatureMC', 
    'play.naturemc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny', 'Vanilla']::text[], 
    false, 
    289, 
    'NatureMC - Survival / PvP / SMP server.'
  ),
  (
    'AnarchyWrath', 
    'anarchywrath.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP']::text[], 
    false, 
    289, 
    'AnarchyWrath - Anarchy / PvP server.'
  ),
  (
    'ShatterMC', 
    'play.shattermc.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    286, 
    'ShatterMC - CrystalPvP / PvP / Duels server.'
  ),
  (
    'BedWarsNexus', 
    'play.bedwarsnexus.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    285, 
    'BedWarsNexus - Bedwars / PvP / Minigames server.'
  ),
  (
    'PrisonGuard', 
    'play.prisonguard.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    285, 
    'PrisonGuard - Prison / PvP / OPPrison server.'
  ),
  (
    'PixelmonPro', 
    'play.pixelmonpro.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    285, 
    'PixelmonPro - Pixelmon / PvP / Survival server.'
  ),
  (
    'UHCArena', 
    'play.uhcarena.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    284, 
    'UHCArena - UHC / PvP / Survival server.'
  ),
  (
    'SMPBattle', 
    'play.smpbattle.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    284, 
    'SMPBattle - Survival / PvP / SMP server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'MinigameCentral', 
    'play.minigamecentral.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    284, 
    'MinigameCentral - Minigames / PvP / Bedwars server.'
  ),
  (
    'UntamedMC', 
    'play.untamedmc.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    283, 
    'UntamedMC - Survival / PvP / SMP server.'
  ),
  (
    'EggWarsHub', 
    'play.eggwarshub.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    283, 
    'EggWarsHub - Minigames / PvP / Bedwars server.'
  ),
  (
    'OPPrisonMax', 
    'play.opprisonmax.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    283, 
    'OPPrisonMax - Prison / PvP / OPPrison server.'
  ),
  (
    'SMPPro', 
    'play.smppro.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    282, 
    'SMPPro - Survival / PvP / SMP server.'
  ),
  (
    'BedWarsFrost', 
    'play.bedwarsfrost.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    281, 
    'BedWarsFrost - Bedwars / PvP / Minigames server.'
  ),
  (
    'LifestealX', 
    'play.lifestealx.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    281, 
    'LifestealX - Lifesteal / PvP / SMP server.'
  ),
  (
    'CrystalPvPShadow', 
    'play.crystalpvpshadow.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    281, 
    'CrystalPvPShadow - CrystalPvP / PvP / Duels server.'
  ),
  (
    'NexusPvP', 
    'play.nexuspvp.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BoxPvP']::text[], 
    false, 
    280, 
    'NexusPvP - PvP / Practice / BoxPvP server.'
  ),
  (
    'TacticalMC', 
    'play.tacticalmc.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    280, 
    'TacticalMC - Factions / PvP / HCF server.'
  ),
  (
    'HawkMC', 
    'play.hawkmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Bedwars']::text[], 
    false, 
    280, 
    'HawkMC - Skywars / PvP / Minigames server.'
  ),
  (
    'SkyWars Plus', 
    'play.skywarsplus.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames']::text[], 
    false, 
    280, 
    'SkyWars Plus - Skywars / PvP / Minigames server.'
  ),
  (
    'BlockPvP', 
    'play.blockpvp.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    280, 
    'BlockPvP - PvP / Practice / KitPvP server.'
  ),
  (
    'NebulaMC', 
    'play.nebulamc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival']::text[], 
    false, 
    280, 
    'NebulaMC - Skyblock / PvP / Survival server.'
  ),
  (
    'PrismMC', 
    'play.prismmc.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Minigames']::text[], 
    false, 
    280, 
    'PrismMC - Skyblock / PvP / Survival server.'
  ),
  (
    'RadiantMC', 
    'play.radiantmc.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival']::text[], 
    false, 
    280, 
    'RadiantMC - Skyblock / PvP / Survival server.'
  ),
  (
    'IronMC', 
    'play.ironmc.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP']::text[], 
    false, 
    280, 
    'IronMC - PvP / Practice / KitPvP server.'
  ),
  (
    'VanillaPvP', 
    'play.vanillapvp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'Vanilla', 'SMP']::text[], 
    false, 
    280, 
    'VanillaPvP - Survival / PvP / Vanilla server.'
  ),
  (
    'BattleRealms', 
    'play.battlerealms.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    280, 
    'BattleRealms - Survival / PvP / SMP server.'
  ),
  (
    'DuelElite', 
    'play.duelelite.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    280, 
    'DuelElite - PvP / Practice / KitPvP server.'
  ),
  (
    'FFAWar', 
    'play.ffawar.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    280, 
    'FFAWar - PvP / Practice / BuildUHC server.'
  ),
  (
    'AlphaSMP', 
    'play.alphasmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    280, 
    'AlphaSMP - Survival / PvP / SMP server.'
  ),
  (
    'HCFLegends', 
    'hcf.hcflegends.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    278, 
    'HCFLegends - HCF / PvP / Factions server.'
  ),
  (
    'HCFNexus', 
    'play.hcfnexus.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    277, 
    'HCFNexus - HCF / PvP / Factions server.'
  ),
  (
    'PvPArena', 
    'play.pvparena..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    276, 
    'PvPArena - PvP / Practice / KitPvP server.'
  ),
  (
    'FeralMC', 
    'play.feralmc.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    276, 
    'FeralMC - Survival / PvP / SMP server.'
  ),
  (
    'FactionsX', 
    'play.factionsx.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    275, 
    'FactionsX - Factions / PvP / HCF server.'
  ),
  (
    'PrisonSupreme', 
    'play.prisonsupreme.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    274, 
    'PrisonSupreme - Prison / PvP / OPPrison server.'
  ),
  (
    'IslandWars', 
    'play.islandwars.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    273, 
    'IslandWars - Skywars / PvP / Minigames server.'
  ),
  (
    'SigmaSMP', 
    'play.sigmasmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny', 'Factions']::text[], 
    false, 
    273, 
    'SigmaSMP - Survival / PvP / SMP server.'
  ),
  (
    'UHCSurvival', 
    'play.uhcsurvival.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    272, 
    'UHCSurvival - UHC / PvP / Survival server.'
  ),
  (
    'DuelMC', 
    'mc.duelmc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    271, 
    'DuelMC - PvP / Practice / KitPvP server.'
  ),
  (
    'KingOfTheHill', 
    'mc.kingofthehill.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid']::text[], 
    false, 
    271, 
    'KingOfTheHill - HCF / PvP / Factions server.'
  ),
  (
    'VanillaSMP', 
    'play.vanillasmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny', 'Factions']::text[], 
    false, 
    271, 
    'VanillaSMP - Survival / PvP / SMP server.'
  ),
  (
    'FactionsEmpire', 
    'play.factionsempire.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    270, 
    'FactionsEmpire - Factions / PvP / HCF server.'
  ),
  (
    'HCFLegion', 
    'play.hcflegion.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid']::text[], 
    false, 
    269, 
    'HCFLegion - Factions / PvP / HCF server.'
  ),
  (
    'HCFEclipse', 
    'play.hcfeclipse.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Economy']::text[], 
    false, 
    269, 
    'HCFEclipse - Factions / PvP / HCF server.'
  ),
  (
    'MurderHub', 
    'play.murderhub.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    269, 
    'MurderHub - Minigames / PvP / Duels server.'
  ),
  (
    'HeroConquest', 
    'play.heroconquest.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes', 'Factions']::text[], 
    false, 
    269, 
    'HeroConquest - RPG / PvP / Custom server.'
  ),
  (
    'KnightPvP', 
    'play.knightpvp.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    269, 
    'KnightPvP - RPG / PvP / Custom server.'
  ),
  (
    'WildMC', 
    'play.wildmc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    268, 
    'WildMC - Survival / PvP / SMP server.'
  ),
  (
    'PrisonExtreme', 
    'play.prisonextreme.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    268, 
    'PrisonExtreme - Prison / PvP / OPPrison server.'
  ),
  (
    'BedWarsCrystal', 
    'play.bedwarscrystal.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Team']::text[], 
    false, 
    267, 
    'BedWarsCrystal - Bedwars / PvP / Minigames server.'
  ),
  (
    'FloatMC', 
    'play.floatmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    267, 
    'FloatMC - Skywars / PvP / Minigames server.'
  ),
  (
    'PrisonLord', 
    'play.prisonlord.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    267, 
    'PrisonLord - Prison / PvP / OPPrison server.'
  ),
  (
    'BedwarsTitan', 
    'play.bedwarstitan.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    267, 
    'BedwarsTitan - Bedwars / PvP / Minigames server.'
  ),
  (
    'RankedPvP', 
    'play.rankedpvp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    267, 
    'RankedPvP - Survival / PvP / SMP server.'
  ),
  (
    'MurderNetwork', 
    'play.murdernetwork.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    266, 
    'MurderNetwork - Minigames / PvP / KitPvP server.'
  ),
  (
    'SkyblockBattle', 
    'play.skyblockbattle.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    266, 
    'SkyblockBattle - Skyblock / PvP / Survival server.'
  ),
  (
    'HCFPrime', 
    'mc.hcfprime.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    265, 
    'HCFPrime - HCF / PvP / Factions server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'PvPRealm', 
    'play.pvprealm.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    265, 
    'PvPRealm - PvP / Practice / KitPvP server.'
  ),
  (
    'RaidedPvP', 
    'raidedpvp.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    264, 
    'RaidedPvP - Anarchy / PvP / Survival server.'
  ),
  (
    'PrisonElite', 
    'play.prisonelite.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    263, 
    'PrisonElite - Prison / PvP / OPPrison server.'
  ),
  (
    'ChronicleMC', 
    'play.chroniclemc.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    263, 
    'ChronicleMC - RPG / PvP / Custom server.'
  ),
  (
    'TaleMC', 
    'play.talemc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    263, 
    'TaleMC - RPG / PvP / Custom server.'
  ),
  (
    'AnarchyReal', 
    'anarchyreal.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP']::text[], 
    false, 
    263, 
    'AnarchyReal - Anarchy / PvP / Survival server.'
  ),
  (
    'WizardMC', 
    'play.wizardmc.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes']::text[], 
    false, 
    262, 
    'WizardMC - RPG / PvP / Custom server.'
  ),
  (
    'HCFApex', 
    'play.hcfapex.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore', 'KitMap']::text[], 
    false, 
    261, 
    'HCFApex - HCF / PvP / Factions server.'
  ),
  (
    'GameWorld', 
    'play.gameworld.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    261, 
    'GameWorld - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'OblivionMC', 
    'play.oblivionmc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    260, 
    'OblivionMC - Factions / PvP / HCF server.'
  ),
  (
    'MomentumMC', 
    'play.momentummc.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    260, 
    'MomentumMC - Factions / PvP / HCF server.'
  ),
  (
    'DeltaMC', 
    'play.deltamc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival']::text[], 
    false, 
    260, 
    'DeltaMC - Skyblock / PvP / Survival server.'
  ),
  (
    'SolarMC', 
    'play.solarmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    260, 
    'SolarMC - Survival / PvP / SMP server.'
  ),
  (
    'FrontierMC', 
    'play.frontiermc.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    260, 
    'FrontierMC - Survival / PvP / SMP server.'
  ),
  (
    'LifeStealPro', 
    'play.lifestealpro.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    260, 
    'LifeStealPro - Lifesteal / PvP / SMP server.'
  ),
  (
    'PvPEmpire', 
    'play.pvpempire.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    259, 
    'PvPEmpire - PvP / Practice / BuildUHC server.'
  ),
  (
    'PracticeNetwork', 
    'play.practicenetwork.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    259, 
    'PracticeNetwork - PvP / Practice / FFA server.'
  ),
  (
    'DrifterSMP', 
    'play.driftersmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    258, 
    'DrifterSMP - Survival / PvP / SMP server.'
  ),
  (
    'BloodArena', 
    'play.bloodarena.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    258, 
    'BloodArena - Lifesteal / PvP / SMP server.'
  ),
  (
    'MinigameHub', 
    'play.minigamehub.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Eggwars', 'Murder', 'Bedwars']::text[], 
    false, 
    258, 
    'MinigameHub - Minigames / PvP / Eggwars server.'
  ),
  (
    'PrisonBoss', 
    'play.prisonboss.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    257, 
    'PrisonBoss - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyPurge', 
    'anarchypurge.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP', 'Survival']::text[], 
    false, 
    257, 
    'AnarchyPurge - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'SkyKingdom', 
    'play.skykingdom.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    257, 
    'SkyKingdom - Skyblock / PvP / Survival server.'
  ),
  (
    'PvPSMP', 
    'play.pvpsmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    257, 
    'PvPSMP - Survival / PvP / SMP server.'
  ),
  (
    'GameNetwork', 
    'play.gamenetwork.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    256, 
    'GameNetwork - Minigames / PvP / Skywars server.'
  ),
  (
    'BedwarsDoubles', 
    'play.bedwarsdoubles.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Quads']::text[], 
    false, 
    256, 
    'BedwarsDoubles - Bedwars / PvP / Minigames server.'
  ),
  (
    'CrystalPvPShadow', 
    'play.crystalpvpshadow.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    255, 
    'CrystalPvPShadow - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SparkMC', 
    'pvp.sparkmc..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    254, 
    'SparkMC - PvP / Practice / KitPvP server.'
  ),
  (
    'PrisonSigma', 
    'play.prisonsigma.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    254, 
    'PrisonSigma - Prison / PvP / OPPrison server.'
  ),
  (
    'CrystalPvPUltimate', 
    'play.crystalpvpultimate.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Arena']::text[], 
    false, 
    253, 
    'CrystalPvPUltimate - CrystalPvP / PvP / Duels server.'
  ),
  (
    'ConquerorMC', 
    'play.conquerormc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    251, 
    'ConquerorMC - PvP / Practice / KitPvP server.'
  ),
  (
    'UHCCrusade', 
    'play.uhccrusade.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    251, 
    'UHCCrusade - UHC / PvP / Survival server.'
  ),
  (
    'CrystalPvPStorm', 
    'play.crystalpvpstorm.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    250, 
    'CrystalPvPStorm - CrystalPvP / PvP / Duels server.'
  ),
  (
    'StrongholdMC', 
    'play.strongholdmc.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore', 'KitMap']::text[], 
    false, 
    249, 
    'StrongholdMC - HCF / PvP / Factions server.'
  ),
  (
    'CrusaderMC', 
    'play.crusadermc.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    249, 
    'CrusaderMC - RPG / PvP / Custom server.'
  ),
  (
    'CrystalPvPRuin', 
    'play.crystalpvpruin.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    249, 
    'CrystalPvPRuin - CrystalPvP / PvP / Duels server.'
  ),
  (
    'LoreMC', 
    'play.loremc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Classes', 'Kingdoms', 'Custom']::text[], 
    false, 
    248, 
    'LoreMC - RPG / PvP / Factions server.'
  ),
  (
    'PrimeSMP', 
    'play.primesmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    248, 
    'PrimeSMP - Survival / PvP / SMP server.'
  ),
  (
    'BlazePvP', 
    'pvp.blazepvp..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    246, 
    'BlazePvP - PvP / Practice / KitPvP server.'
  ),
  (
    'EndMC', 
    'play.endmc.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    246, 
    'EndMC - CrystalPvP / PvP / Duels server.'
  ),
  (
    'FunElite', 
    'play.funelite.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Murder', 'Bedwars', 'Skywars']::text[], 
    false, 
    246, 
    'FunElite - Minigames / PvP / Murder server.'
  ),
  (
    'FunNetwork', 
    'play.funnetwork.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'BuildBattle', 'Parkour', 'Eggwars']::text[], 
    false, 
    245, 
    'FunNetwork - Minigames / PvP / BuildBattle server.'
  ),
  (
    'BedwarsLegend', 
    'play.bedwarslegend.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Trio']::text[], 
    false, 
    245, 
    'BedwarsLegend - Bedwars / PvP / Minigames server.'
  ),
  (
    'DominationSMP', 
    'play.dominationsmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    245, 
    'DominationSMP - Survival / PvP / SMP server.'
  ),
  (
    'RPGPro', 
    'play.rpgpro.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes']::text[], 
    false, 
    245, 
    'RPGPro - RPG / PvP / Custom server.'
  ),
  (
    'LifestealFire', 
    'play.lifestealfire.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    244, 
    'LifestealFire - Lifesteal / PvP / SMP server.'
  ),
  (
    'MinigameNetwork', 
    'play.minigamenetwork.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'FFA', 'BuildBattle', 'Parkour']::text[], 
    false, 
    244, 
    'MinigameNetwork - Minigames / PvP / FFA server.'
  ),
  (
    'BedwarsFrenzy', 
    'play.bedwarsfrenzy.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Doubles']::text[], 
    false, 
    244, 
    'BedwarsFrenzy - Bedwars / PvP / Minigames server.'
  ),
  (
    'PrisonInsane', 
    'play.prisoninsane.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    244, 
    'PrisonInsane - Prison / PvP / OPPrison server.'
  ),
  (
    'PrisonOmega', 
    'play.prisonomega.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    244, 
    'PrisonOmega - Prison / PvP / OPPrison server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'MageWars', 
    'play.magewars.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    243, 
    'MageWars - RPG / PvP / Custom server.'
  ),
  (
    'SkyWarsFrost', 
    'play.skywarsfrost.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    242, 
    'SkyWarsFrost - Skywars / PvP / Minigames server.'
  ),
  (
    'DoomsdayWars', 
    'doomsdaywars.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP']::text[], 
    false, 
    242, 
    'DoomsdayWars - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPRage', 
    'play.crystalpvprage.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    241, 
    'CrystalPvPRage - CrystalPvP / PvP / Duels server.'
  ),
  (
    'PvPEpsilon', 
    'play.pvpepsilon.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    240, 
    'PvPEpsilon - PvP / Practice / KitPvP server.'
  ),
  (
    'SMPHub', 
    'play.smphub.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    238, 
    'SMPHub - Survival / PvP / SMP server.'
  ),
  (
    'ParkourHub', 
    'play.parkourhub.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Parkour', 'Eggwars', 'Murder']::text[], 
    false, 
    237, 
    'ParkourHub - Minigames / PvP / Parkour server.'
  ),
  (
    'CrystalPvPLunar', 
    'play.crystalpvplunar.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    237, 
    'CrystalPvPLunar - CrystalPvP / PvP / Duels server.'
  ),
  (
    'MagePvPElite', 
    'play.magepvpelite.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    237, 
    'MagePvPElite - RPG / PvP / Custom server.'
  ),
  (
    'HCFStorm', 
    'hcf.hcfstorm.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'KitMap']::text[], 
    false, 
    236, 
    'HCFStorm - HCF / PvP / Factions server.'
  ),
  (
    'CloudWars', 
    'play.cloudwars.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    236, 
    'CloudWars - Skyblock / PvP / Survival server.'
  ),
  (
    'BloodWars', 
    'play.bloodwars.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    235, 
    'BloodWars - Lifesteal / PvP / SMP server.'
  ),
  (
    'FloatingPvP', 
    'play.floatingpvp.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    233, 
    'FloatingPvP - Skyblock / PvP / Survival server.'
  ),
  (
    'PrisonDelta', 
    'play.prisondelta.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    233, 
    'PrisonDelta - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyAbyss', 
    'anarchyabyss.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    232, 
    'AnarchyAbyss - Anarchy / PvP / Survival server.'
  ),
  (
    'TNTRun', 
    'play.tntrun.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'BuildBattle', 'Parkour', 'Eggwars']::text[], 
    false, 
    232, 
    'TNTRun - Minigames / PvP / BuildBattle server.'
  ),
  (
    'TrainerMC', 
    'play.trainermc.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Gym']::text[], 
    false, 
    231, 
    'TrainerMC - Pixelmon / PvP / Survival server.'
  ),
  (
    'PracticeMasters', 
    'play.practicemasters.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    231, 
    'PracticeMasters - PvP / Practice / KitPvP server.'
  ),
  (
    'EndCrystalPvP', 
    'play.endcrystalpvp.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    230, 
    'EndCrystalPvP - CrystalPvP / PvP / Duels server.'
  ),
  (
    'GamesMC', 
    'play.gamesmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    230, 
    'GamesMC - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'OPPrisonMadness', 
    'play.opprisonmadness.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    230, 
    'OPPrisonMadness - Prison / PvP / OPPrison server.'
  ),
  (
    'DominionMC', 
    'play.dominionmc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    229, 
    'DominionMC - HCF / PvP / Factions server.'
  ),
  (
    'RaidMC', 
    'play.raidmc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    229, 
    'RaidMC - HCF / PvP / Factions server.'
  ),
  (
    'LifestealLegends', 
    'play.lifesteallegends.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    229, 
    'LifestealLegends - Lifesteal / PvP / SMP server.'
  ),
  (
    'BlockWars', 
    'play.blockwars.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    228, 
    'BlockWars - Bedwars / PvP / Minigames server.'
  ),
  (
    'SurvivalMCPro', 
    'play.survivalmcpro.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    228, 
    'SurvivalMCPro - Survival / PvP / SMP server.'
  ),
  (
    'AnarchyStorm', 
    'anarchystorm.com', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    228, 
    'AnarchyStorm - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPCrash', 
    'play.crystalpvpcrash.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    226, 
    'CrystalPvPCrash - CrystalPvP / PvP / Duels server.'
  ),
  (
    'CrystalPvPDoom', 
    'play.crystalpvpdoom.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    226, 
    'CrystalPvPDoom - CrystalPvP / PvP / Duels server.'
  ),
  (
    'CraftGames', 
    'play.craftgames.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'FFA', 'BuildBattle', 'Parkour']::text[], 
    false, 
    224, 
    'CraftGames - Minigames / PvP / FFA server.'
  ),
  (
    'BastionMC', 
    'play.bastionmc.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid', 'Hardcore']::text[], 
    false, 
    223, 
    'BastionMC - HCF / PvP / Factions server.'
  ),
  (
    'FactionsConquest', 
    'play.factionsconquest.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore']::text[], 
    false, 
    222, 
    'FactionsConquest - Factions / PvP / HCF server.'
  ),
  (
    'SkyRaid', 
    'play.skyraid.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    222, 
    'SkyRaid - Skyblock / PvP / Survival server.'
  ),
  (
    'HeartPvP', 
    'play.heartpvp.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    221, 
    'HeartPvP - Lifesteal / PvP / SMP server.'
  ),
  (
    'TempestMC', 
    'play.tempestmc.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    220, 
    'TempestMC - Factions / PvP / HCF server.'
  ),
  (
    'MercilessSMP', 
    'play.mercilesssmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    220, 
    'MercilessSMP - Survival / PvP / SMP server.'
  ),
  (
    'PrisonBreak', 
    'play.prisonbreak.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    219, 
    'PrisonBreak - Prison / PvP / OPPrison server.'
  ),
  (
    'SMPPvP', 
    'play.smppvp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    219, 
    'SMPPvP - Survival / PvP / SMP server.'
  ),
  (
    'HCFTitans', 
    'hcf.hcftitans.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    217, 
    'HCFTitans - HCF / PvP / Factions server.'
  ),
  (
    'EnderMCPvP', 
    'play.endermcpvp.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    216, 
    'EnderMCPvP - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SMPKingdom', 
    'play.smpkingdom.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla', 'Factions']::text[], 
    false, 
    216, 
    'SMPKingdom - Survival / PvP / SMP server.'
  ),
  (
    'RPGX', 
    'play.rpgx.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes', 'Factions']::text[], 
    false, 
    216, 
    'RPGX - RPG / PvP / Custom server.'
  ),
  (
    'BuildBattleMC', 
    'play.buildbattlemc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Murder', 'Bedwars', 'Skywars']::text[], 
    false, 
    215, 
    'BuildBattleMC - Minigames / PvP / Murder server.'
  ),
  (
    'UHCCentral', 
    'play.uhccentral.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    214, 
    'UHCCentral - UHC / PvP / Survival server.'
  ),
  (
    'CrystalMC Network', 
    'play.crystalmcnetwork.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    213, 
    'CrystalMC Network - CrystalPvP / PvP / Duels server.'
  ),
  (
    'UHCDimension', 
    'play.uhcdimension.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Competitive']::text[], 
    false, 
    213, 
    'UHCDimension - UHC / PvP / Survival server.'
  ),
  (
    'CrystalPvPPurge', 
    'play.crystalpvppurge.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    213, 
    'CrystalPvPPurge - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SkyClash', 
    'play.skyclash.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    212, 
    'SkyClash - Skyblock / PvP / Survival server.'
  ),
  (
    'BedWarsPhoenix', 
    'play.bedwarsphoenix.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    211, 
    'BedWarsPhoenix - Bedwars / PvP / Minigames server.'
  ),
  (
    'MonsterMC', 
    'play.monstermc.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    211, 
    'MonsterMC - Pixelmon / PvP / Survival server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'CrystalPvPFire', 
    'play.crystalpvpfire.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    208, 
    'CrystalPvPFire - CrystalPvP / PvP / Duels server.'
  ),
  (
    'Minepiece', 
    'mp.minepiece.net', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Survival', 'Skyblock']::text[], 
    false, 
    208, 
    'Minepiece - PvP / Survival / Skyblock.'
  ),
  (
    'AnarchyRealm', 
    'anarchyrealm.org', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'CrystalPvP']::text[], 
    false, 
    207, 
    'AnarchyRealm - Anarchy / PvP / CrystalPvP server.'
  ),
  (
    'BedwarsCrystal', 
    'play.bedwarscrystal.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Quads']::text[], 
    false, 
    207, 
    'BedwarsCrystal - Bedwars / PvP / Minigames server.'
  ),
  (
    'HCFWorld', 
    'hcf.hcfworld.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid', 'KitMap']::text[], 
    false, 
    206, 
    'HCFWorld - HCF / PvP / Factions server.'
  ),
  (
    'OPPrisonUltimate', 
    'play.opprisonultimate.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    206, 
    'OPPrisonUltimate - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyUnlimited', 
    'anarchyunlimited.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    206, 
    'AnarchyUnlimited - Anarchy / PvP / Survival server.'
  ),
  (
    'UHCChampion', 
    'play.uhcchampion.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Ranked']::text[], 
    false, 
    205, 
    'UHCChampion - UHC / PvP / Survival server.'
  ),
  (
    'AnarchyWorld', 
    'anarchyworld.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    205, 
    'AnarchyWorld - Anarchy / PvP / Survival server.'
  ),
  (
    'VelocityMC', 
    'pvp.velocitymc..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    204, 
    'VelocityMC - PvP / Practice / KitPvP server.'
  ),
  (
    'BedwarsDragon', 
    'play.bedwarsdragon.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    204, 
    'BedwarsDragon - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedwarsCitadel', 
    'play.bedwarscitadel.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Trio']::text[], 
    false, 
    204, 
    'BedwarsCitadel - Bedwars / PvP / Minigames server.'
  ),
  (
    'HCFBattle', 
    'mc.hcfbattle.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'KitMap']::text[], 
    false, 
    203, 
    'HCFBattle - HCF / PvP / Factions server.'
  ),
  (
    'SkyWarsShadow', 
    'play.skywarsshadow.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    203, 
    'SkyWarsShadow - Skywars / PvP / Minigames server.'
  ),
  (
    'SkyWarsCrystal', 
    'play.skywarscrystal.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    203, 
    'SkyWarsCrystal - Skywars / PvP / Minigames server.'
  ),
  (
    'UHCMasters', 
    'play.uhcmasters.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    203, 
    'UHCMasters - UHC / PvP / Survival server.'
  ),
  (
    'PrisonRanks', 
    'play.prisonranks.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    203, 
    'PrisonRanks - Prison / PvP / OPPrison server.'
  ),
  (
    'AetherBattle', 
    'play.aetherbattle.net', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Economy']::text[], 
    false, 
    203, 
    'AetherBattle - Skyblock / PvP / Survival server.'
  ),
  (
    'LabMC', 
    'play.labmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    202, 
    'LabMC - Minigames / PvP / Duels server.'
  ),
  (
    'WarSMP', 
    'play.warsmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    202, 
    'WarSMP - Survival / PvP / SMP server.'
  ),
  (
    'MineLatino', 
    'mp.minelatino.net', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'KitPvP', 'Skywars', 'Prison', 'Survival', 'Skyblock']::text[], 
    false, 
    202, 
    'MineLatino - PvP / KitPvP / Skywars.'
  ),
  (
    'SMPEmpire', 
    'play.smpempire.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    201, 
    'SMPEmpire - Survival / PvP / SMP server.'
  ),
  (
    'PrisonPro', 
    'play.prisonpro.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    200, 
    'PrisonPro - Prison / PvP / OPPrison server.'
  ),
  (
    'BedwarsStorm', 
    'play.bedwarsstorm.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Trio']::text[], 
    false, 
    200, 
    'BedwarsStorm - Bedwars / PvP / Minigames server.'
  ),
  (
    'HCFHub', 
    'hcf.hcfhub.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    199, 
    'HCFHub - HCF / PvP / Factions server.'
  ),
  (
    'GamePro', 
    'play.gamepro.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    199, 
    'GamePro - Minigames / PvP / Duels server.'
  ),
  (
    'UltimisMC', 
    'mp.ultimis.net', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Factions', 'Bedwars', 'Skywars', 'Prison', 'Survival']::text[], 
    false, 
    199, 
    'UltimisMC - PvP / Factions / Bedwars.'
  ),
  (
    'PrisonMines', 
    'play.prisonmines.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    198, 
    'PrisonMines - Prison / PvP / OPPrison server.'
  ),
  (
    'MageMC', 
    'play.magemc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Custom']::text[], 
    false, 
    198, 
    'MageMC - RPG / PvP / Factions server.'
  ),
  (
    'CitadelMC', 
    'mc.citadelmc.net', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    197, 
    'CitadelMC - HCF / PvP / Factions server.'
  ),
  (
    'Skywars Hub', 
    'play.skywarshub.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    197, 
    'Skywars Hub - Skywars / PvP / Minigames server.'
  ),
  (
    'DrainMC', 
    'play.drainmc.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    197, 
    'DrainMC - Lifesteal / PvP / SMP server.'
  ),
  (
    'PvPDelta', 
    'play.pvpdelta.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    197, 
    'PvPDelta - PvP / Practice / NoDebuff server.'
  ),
  (
    'AetherPvP', 
    'play.aetherpvp.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    197, 
    'AetherPvP - Skyblock / PvP / Survival server.'
  ),
  (
    'PillageMC', 
    'pillagemc.com', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    197, 
    'PillageMC - Anarchy / PvP / Survival server.'
  ),
  (
    'SupremacySMP', 
    'play.supremacysmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    197, 
    'SupremacySMP - Survival / PvP / SMP server.'
  ),
  (
    'FragmentMC', 
    'play.fragmentmc.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    196, 
    'FragmentMC - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SoulEmpire', 
    'play.soulempire.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    196, 
    'SoulEmpire - Lifesteal / PvP / SMP server.'
  ),
  (
    'SkyRealm', 
    'play.skyrealm.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    196, 
    'SkyRealm - Skyblock / PvP / Survival server.'
  ),
  (
    'CrystalPvPAbyss', 
    'play.crystalpvpabyss.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    196, 
    'CrystalPvPAbyss - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SkyWarsNova', 
    'play.skywarsnova.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    195, 
    'SkyWarsNova - Skywars / PvP / Minigames server.'
  ),
  (
    'RushMC', 
    'play.rushmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    195, 
    'RushMC - Minigames / PvP / Bedwars server.'
  ),
  (
    'AnarchyTotal', 
    'anarchytotal.com', 
    25565, 
    '1.12-1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    195, 
    'AnarchyTotal - Anarchy / PvP / Survival server.'
  ),
  (
    'AeroMC', 
    'play.aeromc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    193, 
    'AeroMC - Skywars / PvP / Minigames server.'
  ),
  (
    'mp.pika.host | PikaNetwork', 
    'mp.pika.host', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'KitPvP', 'Factions', 'Bedwars', 'Prison', 'Survival']::text[], 
    false, 
    193, 
    'mp.pika.host | PikaNetwork - PvP / KitPvP / Factions.'
  ),
  (
    'KothMC', 
    'play.kothmc.gg', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Hardcore']::text[], 
    false, 
    192, 
    'KothMC - HCF / PvP / Factions server.'
  ),
  (
    'SMPNetwork', 
    'play.smpnetwork.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    192, 
    'SMPNetwork - Survival / PvP / SMP server.'
  ),
  (
    'HardcoreMC', 
    'hcf.hardcoremc.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    191, 
    'HardcoreMC - HCF / PvP / Factions server.'
  ),
  (
    'CrystalPvPStorm', 
    'play.crystalpvpstorm.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    191, 
    'CrystalPvPStorm - CrystalPvP / PvP / Duels server.'
  ),
  (
    'BedwarsTurbo', 
    'play.bedwarsturbo.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Trio']::text[], 
    false, 
    191, 
    'BedwarsTurbo - Bedwars / PvP / Minigames server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'HCFVanguard', 
    'mc.hcfvanguard.com', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions', 'Raid']::text[], 
    false, 
    190, 
    'HCFVanguard - HCF / PvP / Factions server.'
  ),
  (
    'AetherRaid', 
    'play.aetherraid.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    190, 
    'AetherRaid - Skyblock / PvP / Survival server.'
  ),
  (
    'CrystalPvPStrike', 
    'play.crystalpvpstrike.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    190, 
    'CrystalPvPStrike - CrystalPvP / PvP / Duels server.'
  ),
  (
    'PrisonCount', 
    'play.prisoncount.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    189, 
    'PrisonCount - Prison / PvP / OPPrison server.'
  ),
  (
    'GameMC', 
    'play.gamemc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    189, 
    'GameMC - Minigames / PvP / Skywars server.'
  ),
  (
    'SuperiorSMP', 
    'play.superiorsmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    189, 
    'SuperiorSMP - Survival / PvP / SMP server.'
  ),
  (
    'HCFSpectre', 
    'hcf.hcfspectre.org', 
    25565, 
    '1.8', 
    ARRAY['HCF', 'PvP', 'Factions']::text[], 
    false, 
    188, 
    'HCFSpectre - HCF / PvP / Factions server.'
  ),
  (
    'PrisonZeta', 
    'play.prisonzeta.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    188, 
    'PrisonZeta - Prison / PvP / OPPrison server.'
  ),
  (
    'HardcoreUHC', 
    'play.hardcoreuhc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['UHC', 'PvP', 'Survival', 'Deathmatch']::text[], 
    false, 
    187, 
    'HardcoreUHC - UHC / PvP / Survival server.'
  ),
  (
    'AssassinMC', 
    'play.assassinmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Classes', 'Kingdoms', 'Custom']::text[], 
    false, 
    187, 
    'AssassinMC - RPG / PvP / Factions server.'
  ),
  (
    'CrystalPvPVoid', 
    'play.crystalpvpvoid.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    187, 
    'CrystalPvPVoid - CrystalPvP / PvP / Duels server.'
  ),
  (
    'ChillSMP', 
    'play.chillsmp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    186, 
    'ChillSMP - Survival / PvP / SMP server.'
  ),
  (
    'ReapMC', 
    'pvp.reapmc..org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    185, 
    'ReapMC - PvP / Practice / KitPvP server.'
  ),
  (
    'HCFPhantom', 
    'play.hcfphantom.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid']::text[], 
    false, 
    184, 
    'HCFPhantom - Factions / PvP / HCF server.'
  ),
  (
    'FactionsPro', 
    'play.factionspro.com', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Raid']::text[], 
    false, 
    184, 
    'FactionsPro - Factions / PvP / HCF server.'
  ),
  (
    'MurderMC', 
    'play.murdermc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    184, 
    'MurderMC - Minigames / PvP / Bedwars server.'
  ),
  (
    'SkywarsRoyale', 
    'play.skywarsroyale.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    183, 
    'SkywarsRoyale - Skywars / PvP / Minigames server.'
  ),
  (
    'HCFBattle', 
    'play.hcfbattle.org', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    183, 
    'HCFBattle - Factions / PvP / HCF server.'
  ),
  (
    'BedwarsQuick', 
    'play.bedwarsquick.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Doubles']::text[], 
    false, 
    183, 
    'BedwarsQuick - Bedwars / PvP / Minigames server.'
  ),
  (
    'LootMC', 
    'lootmc.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    183, 
    'LootMC - Anarchy / PvP / Survival server.'
  ),
  (
    'FuryMC', 
    'play.furymc..com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    181, 
    'FuryMC - PvP / Practice / KitPvP server.'
  ),
  (
    'HCFStorm', 
    'play.hcfstorm.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF', 'Hardcore']::text[], 
    false, 
    181, 
    'HCFStorm - Factions / PvP / HCF server.'
  ),
  (
    'SkyWarsUltimate', 
    'play.skywarsultimate.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    180, 
    'SkyWarsUltimate - Skywars / PvP / Minigames server.'
  ),
  (
    'MinigamePro', 
    'play.minigamepro.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    180, 
    'MinigamePro - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'ClassPvP', 
    'play.classpvp.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    179, 
    'ClassPvP - RPG / PvP / Custom server.'
  ),
  (
    'MineBerry', 
    'go.mineberry.org', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'KitPvP', 'Bedwars', 'Skywars', 'Survival', 'Minigames']::text[], 
    false, 
    179, 
    'MineBerry - PvP / KitPvP / Bedwars.'
  ),
  (
    'PrisonTycoon', 
    'play.prisontycoon.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    178, 
    'PrisonTycoon - Prison / PvP / OPPrison server.'
  ),
  (
    'GameElite', 
    'play.gameelite.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    177, 
    'GameElite - Minigames / PvP / KitPvP server.'
  ),
  (
    'OPPrisonPro', 
    'play.opprisonpro.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    176, 
    'OPPrisonPro - Prison / PvP / OPPrison server.'
  ),
  (
    'AnarchyComplete', 
    'anarchycomplete.net', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP']::text[], 
    false, 
    175, 
    'AnarchyComplete - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPSolar', 
    'play.crystalpvpsolar.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    175, 
    'CrystalPvPSolar - CrystalPvP / PvP / Duels server.'
  ),
  (
    'CrystalPvPEdge', 
    'play.crystalpvpedge.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    174, 
    'CrystalPvPEdge - CrystalPvP / PvP / Duels server.'
  ),
  (
    'PrisonKing', 
    'play.prisonking.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Ranks']::text[], 
    false, 
    172, 
    'PrisonKing - Prison / PvP / OPPrison server.'
  ),
  (
    'BedwarsSolo', 
    'play.bedwarssolo.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Trio']::text[], 
    false, 
    172, 
    'BedwarsSolo - Bedwars / PvP / Minigames server.'
  ),
  (
    'DoomsdayBattle', 
    'doomsdaybattle.com', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival']::text[], 
    false, 
    172, 
    'DoomsdayBattle - Anarchy / PvP / Survival server.'
  ),
  (
    'AetherConquest', 
    'play.aetherconquest.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    170, 
    'AetherConquest - Skyblock / PvP / Survival server.'
  ),
  (
    'PillagePvP', 
    'pillagepvp.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP', 'Raid']::text[], 
    false, 
    170, 
    'PillagePvP - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPImpact', 
    'play.crystalpvpimpact.net', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    170, 
    'CrystalPvPImpact - CrystalPvP / PvP / Duels server.'
  ),
  (
    'SkyWarsFire', 
    'play.skywarsfire.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Insane']::text[], 
    false, 
    169, 
    'SkyWarsFire - Skywars / PvP / Minigames server.'
  ),
  (
    'PracticePro', 
    'play.practicepro.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    169, 
    'PracticePro - PvP / Practice / KitPvP server.'
  ),
  (
    'BedwarsDuel', 
    'play.bedwarsduel.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    169, 
    'BedwarsDuel - Bedwars / PvP / Minigames server.'
  ),
  (
    'RPGRealms', 
    'play.rpgrealms.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    168, 
    'RPGRealms - RPG / PvP / Custom server.'
  ),
  (
    'GauntletMC', 
    'play.gauntletmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Bedwars', 'Skywars', 'SurvivalGames']::text[], 
    false, 
    167, 
    'GauntletMC - Minigames / PvP / Bedwars server.'
  ),
  (
    'HCFSpectre', 
    'play.hcfspectre.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    167, 
    'HCFSpectre - Factions / PvP / HCF server.'
  ),
  (
    'HeroWars', 
    'play.herowars.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    167, 
    'HeroWars - RPG / PvP / Custom server.'
  ),
  (
    'CombatMC', 
    'mc.combatmc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    166, 
    'CombatMC - PvP / Practice / KitPvP server.'
  ),
  (
    'SkywarsElite', 
    'play.skywarselite.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Skywars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    166, 
    'SkywarsElite - Skywars / PvP / Minigames server.'
  ),
  (
    'BedwarsKeep', 
    'play.bedwarskeep.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Quads']::text[], 
    false, 
    166, 
    'BedwarsKeep - Bedwars / PvP / Minigames server.'
  ),
  (
    'MC.SOULCRAFT.TC Minecraft Servers In Turkey', 
    'mc.soulcraft.tc', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Practice', 'Survival', 'Skyblock']::text[], 
    false, 
    166, 
    'MC.SOULCRAFT.TC Minecraft Servers In Turkey - PvP / Practice / Survival.'
  ),
  (
    'EggWarsPro', 
    'play.eggwarspro.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Duels', 'KitPvP', 'FFA']::text[], 
    false, 
    165, 
    'EggWarsPro - Minigames / PvP / Duels server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'SkyblockConquest', 
    'play.skyblockconquest.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    164, 
    'SkyblockConquest - Skyblock / PvP / Survival server.'
  ),
  (
    'SMPRaid', 
    'play.smpraid.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    164, 
    'SMPRaid - Survival / PvP / SMP server.'
  ),
  (
    'HeartConquest', 
    'play.heartconquest.org', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    163, 
    'HeartConquest - Lifesteal / PvP / SMP server.'
  ),
  (
    'OPPrisonChaos', 
    'play.opprisonchaos.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines']::text[], 
    false, 
    163, 
    'OPPrisonChaos - Prison / PvP / OPPrison server.'
  ),
  (
    'ThunderMC', 
    'mc.thundermc..net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    162, 
    'ThunderMC - PvP / Practice / KitPvP server.'
  ),
  (
    'ArcherMC', 
    'play.archermc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Classes', 'Custom']::text[], 
    false, 
    162, 
    'ArcherMC - RPG / PvP / Classes server.'
  ),
  (
    'SoulBattle', 
    'play.soulbattle.com', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Survival']::text[], 
    false, 
    162, 
    'SoulBattle - Lifesteal / PvP / SMP server.'
  ),
  (
    'DrainPvP', 
    'play.drainpvp.net', 
    25565, 
    '1.21', 
    ARRAY['Lifesteal', 'PvP', 'SMP', 'Hardcore']::text[], 
    false, 
    162, 
    'DrainPvP - Lifesteal / PvP / SMP server.'
  ),
  (
    'RaidSurvival', 
    'raidsurvival.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'Raid']::text[], 
    false, 
    160, 
    'RaidSurvival - Anarchy / PvP / Survival server.'
  ),
  (
    'CrystalPvPX', 
    'play.crystalpvpx.org', 
    25565, 
    '1.12-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Ranked']::text[], 
    false, 
    159, 
    'CrystalPvPX - CrystalPvP / PvP / Duels server.'
  ),
  (
    'AdventurePvP', 
    'play.adventurepvp.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Factions', 'Custom']::text[], 
    false, 
    158, 
    'AdventurePvP - RPG / PvP / Factions server.'
  ),
  (
    'BedwarsRush', 
    'play.bedwarsrush.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    158, 
    'BedwarsRush - Bedwars / PvP / Minigames server.'
  ),
  (
    'AnarchySurvival', 
    'anarchysurvival.org', 
    25565, 
    '1.21', 
    ARRAY['Anarchy', 'PvP', 'Survival', 'CrystalPvP', 'Raid']::text[], 
    false, 
    158, 
    'AnarchySurvival - Anarchy / PvP / Survival server.'
  ),
  (
    'SkyFactions', 
    'play.skyfactions.org', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Ranks']::text[], 
    false, 
    157, 
    'SkyFactions - Skyblock / PvP / Survival server.'
  ),
  (
    'kitPvPElite', 
    'play.kitpvpelite.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    156, 
    'kitPvPElite - PvP / Practice / KitPvP server.'
  ),
  (
    'ConcordMC', 
    'play.concordmc.net', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Survival', 'Lifesteal']::text[], 
    false, 
    156, 
    'ConcordMC - PvP / Survival / Lifesteal.'
  ),
  (
    'CrystalPvPMaster', 
    'play.crystalpvpmaster.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    155, 
    'CrystalPvPMaster - CrystalPvP / PvP / Duels server.'
  ),
  (
    'PokeRealm', 
    'play.pokerealm.net', 
    25565, 
    '1.16-1.21', 
    ARRAY['Pixelmon', 'PvP', 'Survival', 'Battle']::text[], 
    false, 
    154, 
    'PokeRealm - Pixelmon / PvP / Survival server.'
  ),
  (
    'CrystalPvPSmash', 
    'play.crystalpvpsmash.com', 
    25565, 
    '1.16-1.21', 
    ARRAY['CrystalPvP', 'PvP', 'Duels', 'Practice']::text[], 
    false, 
    154, 
    'CrystalPvPSmash - CrystalPvP / PvP / Duels server.'
  ),
  (
    'WildernessPvP', 
    'play.wildernesspvp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Vanilla']::text[], 
    false, 
    153, 
    'WildernessPvP - Survival / PvP / SMP server.'
  ),
  (
    'PlayMC', 
    'play.playmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    153, 
    'PlayMC - Minigames / PvP / KitPvP server.'
  ),
  (
    'FFALegends', 
    'play.ffalegends.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    153, 
    'FFALegends - PvP / Practice / FFA server.'
  ),
  (
    'BedwarsFort', 
    'play.bedwarsfort.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    153, 
    'BedwarsFort - Bedwars / PvP / Minigames server.'
  ),
  (
    'ExcitementMC', 
    'play.excitementmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    152, 
    'ExcitementMC - Minigames / PvP / Skywars server.'
  ),
  (
    'FactionsSovereign', 
    'play.factionssovereign.net', 
    25565, 
    '1.8', 
    ARRAY['Factions', 'PvP', 'HCF']::text[], 
    false, 
    151, 
    'FactionsSovereign - Factions / PvP / HCF server.'
  ),
  (
    'HeroRealm', 
    'play.herorealm.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    151, 
    'HeroRealm - RPG / PvP / Custom server.'
  ),
  (
    'ExperimentMC', 
    'play.experimentmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    150, 
    'ExperimentMC - Minigames / PvP / KitPvP server.'
  ),
  (
    'MinigameX', 
    'play.minigamex.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Parkour', 'Eggwars', 'Murder']::text[], 
    false, 
    150, 
    'MinigameX - Minigames / PvP / Parkour server.'
  ),
  (
    'ChickenNW', 
    'oyna.chickennw.com', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'Survival', 'Skyblock']::text[], 
    false, 
    150, 
    'ChickenNW - PvP / Survival / Skyblock.'
  ),
  (
    'PracticeWorld', 
    'play.practiceworld.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    148, 
    'PracticeWorld - PvP / Practice / NoDebuff server.'
  ),
  (
    'ParkourElite', 
    'play.parkourelite.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Eggwars', 'Murder', 'Bedwars']::text[], 
    false, 
    148, 
    'ParkourElite - Minigames / PvP / Eggwars server.'
  ),
  (
    'CompetitivePvP', 
    'play.competitivepvp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    148, 
    'CompetitivePvP - Survival / PvP / SMP server.'
  ),
  (
    'OPBlocks Network', 
    'mp.opblocks.com', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'Prison', 'Survival', 'Skyblock']::text[], 
    false, 
    147, 
    'OPBlocks Network - PvP / Prison / Survival.'
  ),
  (
    'MinigameArena', 
    'play.minigamearena.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Murder', 'Bedwars', 'Skywars']::text[], 
    false, 
    144, 
    'MinigameArena - Minigames / PvP / Murder server.'
  ),
  (
    'PvPZeta', 
    'play.pvpzeta.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    143, 
    'PvPZeta - PvP / Practice / FFA server.'
  ),
  (
    'PracticePlus', 
    'play.practiceplus.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    143, 
    'PracticePlus - PvP / Practice / BuildUHC server.'
  ),
  (
    'FFAPro', 
    'play.ffapro.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    143, 
    'FFAPro - PvP / Practice / KitPvP server.'
  ),
  (
    'PrisonChaos', 
    'play.prisonchaos.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison', 'Mines', 'Ranks']::text[], 
    false, 
    142, 
    'PrisonChaos - Prison / PvP / OPPrison server.'
  ),
  (
    'MinePeak', 
    'go.minepeak.org', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'KitPvP', 'Bedwars', 'Skywars', 'Survival', 'Minigames']::text[], 
    false, 
    142, 
    'MinePeak - PvP / KitPvP / Bedwars.'
  ),
  (
    'RPGPlus', 
    'play.rpgplus.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    141, 
    'RPGPlus - RPG / PvP / Custom server.'
  ),
  (
    'MCPrisonNetwork', 
    'play.mcprisonnetwork.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Prison', 'PvP', 'OPPrison']::text[], 
    false, 
    138, 
    'MCPrisonNetwork - Prison / PvP / OPPrison server.'
  ),
  (
    'CompetitiveSMP', 
    'play.competitivesmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    138, 
    'CompetitiveSMP - Survival / PvP / SMP server.'
  ),
  (
    'SMPFactions', 
    'play.smpfactions.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP']::text[], 
    false, 
    137, 
    'SMPFactions - Survival / PvP / SMP server.'
  ),
  (
    'SkyConquest', 
    'play.skyconquest.com', 
    25565, 
    '1.21', 
    ARRAY['Skyblock', 'PvP', 'Survival', 'Custom']::text[], 
    false, 
    136, 
    'SkyConquest - Skyblock / PvP / Survival server.'
  ),
  (
    'hub.havoc.games', 
    'hub.havoc.games', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'Survival']::text[], 
    false, 
    136, 
    'hub.havoc.games - PvP / Survival.'
  ),
  (
    'PracticePlus', 
    'play.practiceplus.org', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'NoDebuff', 'Ranked']::text[], 
    false, 
    135, 
    'PracticePlus - PvP / Practice / NoDebuff server.'
  ),
  (
    'HeroPvP', 
    'play.heropvp.gg', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Classes']::text[], 
    false, 
    134, 
    'HeroPvP - RPG / PvP / Custom server.'
  ),
  (
    'BedwarsCastle', 
    'play.bedwarscastle.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    133, 
    'BedwarsCastle - Bedwars / PvP / Minigames server.'
  ),
  (
    'ClassWars', 
    'play.classwars.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    132, 
    'ClassWars - RPG / PvP / Custom server.'
  ),
  (
    'CasualSMP', 
    'play.casualsmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    131, 
    'CasualSMP - Survival / PvP / SMP server.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'FFAConquest', 
    'play.ffaconquest.net', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'FFA', 'BoxPvP']::text[], 
    false, 
    129, 
    'FFAConquest - PvP / Practice / FFA server.'
  ),
  (
    'SMPHardcore', 
    'play.smphardcore.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    127, 
    'SMPHardcore - Survival / PvP / SMP server.'
  ),
  (
    'ClassMC', 
    'play.classmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    127, 
    'ClassMC - RPG / PvP / Custom server.'
  ),
  (
    'TerritorySMP', 
    'play.territorysmp.com', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Factions']::text[], 
    false, 
    126, 
    'TerritorySMP - Survival / PvP / SMP server.'
  ),
  (
    'EliteSMP', 
    'play.elitesmp.org', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    126, 
    'EliteSMP - Survival / PvP / SMP server.'
  ),
  (
    'FFAWorld', 
    'play.ffaworld.gg', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'BuildUHC', 'Sumo']::text[], 
    false, 
    125, 
    'FFAWorld - PvP / Practice / BuildUHC server.'
  ),
  (
    'ClassConquest', 
    'play.classconquest.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom', 'Factions']::text[], 
    false, 
    124, 
    'ClassConquest - RPG / PvP / Custom server.'
  ),
  (
    'ThrillMC', 
    'play.thrillmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Parkour', 'Bedwars', 'Skywars']::text[], 
    false, 
    123, 
    'ThrillMC - Minigames / PvP / Parkour server.'
  ),
  (
    'ActionMC', 
    'play.actionmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    123, 
    'ActionMC - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'CasualPvP', 
    'play.casualpvp.net', 
    25565, 
    '1.21', 
    ARRAY['Survival', 'PvP', 'SMP', 'Towny']::text[], 
    false, 
    123, 
    'CasualPvP - Survival / PvP / SMP server.'
  ),
  (
    'HungerGamesMC', 
    'play.hungergamesmc.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Skywars', 'SurvivalGames', 'Duels']::text[], 
    false, 
    121, 
    'HungerGamesMC - Minigames / PvP / Skywars server.'
  ),
  (
    'WarlockMC', 
    'play.warlockmc.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['RPG', 'PvP', 'Custom']::text[], 
    false, 
    120, 
    'WarlockMC - RPG / PvP / Custom server.'
  ),
  (
    'TrialsMC', 
    'play.trialsmc.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'SurvivalGames', 'Duels', 'KitPvP']::text[], 
    false, 
    119, 
    'TrialsMC - Minigames / PvP / SurvivalGames server.'
  ),
  (
    'play.minemalia.net - 1.21.11', 
    'play.minemalia.org', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Factions', 'Bedwars', 'Prison', 'Survival', 'Skyblock']::text[], 
    false, 
    117, 
    'play.minemalia.net - 1.21.11 - PvP / Factions / Bedwars.'
  ),
  (
    'BedwarsX', 
    'play.bedwarsx.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    116, 
    'BedwarsX - Bedwars / PvP / Minigames server.'
  ),
  (
    'BedwarsInsane', 
    'play.bedwarsinsane.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Trio']::text[], 
    false, 
    115, 
    'BedwarsInsane - Bedwars / PvP / Minigames server.'
  ),
  (
    'Altus Network', 
    'mmp.altusnetwork.net', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Survival']::text[], 
    false, 
    115, 
    'Altus Network - PvP / Survival.'
  ),
  (
    'BedwarsChaos', 
    'play.bedwarschaos.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Ranked']::text[], 
    false, 
    114, 
    'BedwarsChaos - Bedwars / PvP / Minigames server.'
  ),
  (
    'play.hanedanmc.com:25565', 
    'play.hanedanmc.com', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Practice', 'Survival', 'Skyblock', 'Minigames']::text[], 
    false, 
    114, 
    'play.hanedanmc.com:25565 - PvP / Practice / Survival.'
  ),
  (
    'BedwarsTrio', 
    'play.bedwarstrio.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Solo']::text[], 
    false, 
    112, 
    'BedwarsTrio - Bedwars / PvP / Minigames server.'
  ),
  (
    'FFAArena', 
    'play.ffaarena.com', 
    25565, 
    '1.8', 
    ARRAY['PvP', 'Practice', 'KitPvP', 'Duels']::text[], 
    false, 
    111, 
    'FFAArena - PvP / Practice / KitPvP server.'
  ),
  (
    'BedwarsBlitz', 
    'play.bedwarsblitz.org', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Quads']::text[], 
    false, 
    110, 
    'BedwarsBlitz - Bedwars / PvP / Minigames server.'
  ),
  (
    'ParkourPro', 
    'play.parkourpro.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'BuildBattle', 'Parkour', 'Eggwars']::text[], 
    false, 
    109, 
    'ParkourPro - Minigames / PvP / BuildBattle server.'
  ),
  (
    'AtlantikMC', 
    'oyna.atlantikmc.com', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Survival', 'Skyblock']::text[], 
    false, 
    106, 
    'AtlantikMC - PvP / Survival / Skyblock.'
  ),
  (
    'Minecrafty - Friendly Survival SMP', 
    'fun.minecrafty.org', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Practice', 'Bedwars', 'Prison', 'Survival', 'Skyblock']::text[], 
    false, 
    103, 
    'Minecrafty - Friendly Survival SMP - PvP / Practice / Bedwars.'
  ),
  (
    'BananaSMP', 
    'play.bananasmp.net', 
    25565, 
    '1.21', 
    ARRAY['PvP', 'KitPvP', 'Survival', 'Lifesteal', 'FFA']::text[], 
    false, 
    103, 
    'BananaSMP - PvP / KitPvP / Survival.'
  ),
  (
    'BedwarsQuad', 
    'play.bedwarsquad.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Bedwars', 'PvP', 'Minigames', 'Doubles']::text[], 
    false, 
    100, 
    'BedwarsQuad - Bedwars / PvP / Minigames server.'
  ),
  (
    'CosmosMC', 
    'mcmp.cosmosmc.org', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'Survival', 'Skyblock', 'Lifesteal']::text[], 
    false, 
    99, 
    'CosmosMC - PvP / Survival / Skyblock.'
  ),
  (
    'BLOKYA - Türkiye''nin Yeni SMP Survival Sunucusu', 
    'oyna.blokya.com', 
    25565, 
    '1.21', 
    ARRAY['PvP', 'Survival']::text[], 
    false, 
    96, 
    'BLOKYA - Türkiye''nin Yeni SMP Survival Sunucusu - PvP / Survival.'
  ),
  (
    'minehut.comOnline 1120 3897Minehut.com The Server Hosting Network      NEW SMP B', 
    'minehut.com', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    95, 
    'minehut.comOnline 1120 3897Minehut.com The Server Hosting Network      NEW SMP B - PvP server.'
  ),
  (
    'AppleMC', 
    'play.applemc.fun', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'Lifesteal']::text[], 
    false, 
    93, 
    'AppleMC - PvP / Lifesteal.'
  ),
  (
    'moxmc.netOnline 2760 888             >>[ PURPLE PRISON ]<<             ✿ /WARP E', 
    'moxmc.net', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    91, 
    'moxmc.netOnline 2760 888             >>[ PURPLE PRISON ]<<             ✿ /WARP E - PvP server.'
  ),
  (
    'TNTRush', 
    'play.tntrush.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'Parkour', 'Eggwars', 'Murder']::text[], 
    false, 
    90, 
    'TNTRush - Minigames / PvP / Parkour server.'
  ),
  (
    'FunHub', 
    'play.funhub.com', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'FFA', 'BuildBattle', 'Parkour']::text[], 
    false, 
    89, 
    'FunHub - Minigames / PvP / FFA server.'
  ),
  (
    'MinigameLegends', 
    'play.minigamelegends.net', 
    25565, 
    '1.8-1.21', 
    ARRAY['Minigames', 'PvP', 'KitPvP', 'FFA', 'BuildBattle']::text[], 
    false, 
    86, 
    'MinigameLegends - Minigames / PvP / KitPvP server.'
  ),
  (
    'dream.clubcraft.net (SMP, Lifesteal, BedWars, PVP + more) 🏆Online 4356 583|||||', 
    'clubcraft.net', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    86, 
    'dream.clubcraft.net (SMP, Lifesteal, BedWars, PVP + more) 🏆Online 4356 583||||| - PvP server.'
  ),
  (
    'EarthMC', 
    'mp.earthmc.net', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'Factions', 'Survival']::text[], 
    false, 
    82, 
    'EarthMC - PvP / Factions / Survival.'
  ),
  (
    'AdderallMCOnline 438 0AdderallMC - Join the discord!discord.adderall.ir or https', 
    'discord.gg', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    82, 
    'AdderallMCOnline 438 0AdderallMC - Join the discord!discord.adderall.ir or https - PvP server.'
  ),
  (
    'play.pvplegacy.netOffline 1159 0              🗡 PvP Legacy [1.21.2+] 🏹Custom d', 
    'pvplegacy.net', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    81, 
    'play.pvplegacy.netOffline 1159 0              🗡 PvP Legacy [1.21.2+] 🏹Custom d - PvP server.'
  ),
  (
    'Kampung Eles', 
    'play.kampungeles.id', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Practice', 'Survival']::text[], 
    false, 
    71, 
    'Kampung Eles - PvP / Practice / Survival.'
  ),
  (
    'MossCraft', 
    'mosscraft.net', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'Survival', 'Minigames']::text[], 
    false, 
    59, 
    'MossCraft - PvP / Survival / Minigames.'
  ),
  (
    'mchub.comOnline 2102 1434◆  MCHUB | 1.21.5+  ◆PRISONS IS NOW OUT', 
    'mchub.com', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    57, 
    'mchub.comOnline 2102 1434◆  MCHUB | 1.21.5+  ◆PRISONS IS NOW OUT - PvP server.'
  ),
  (
    'DugeCraft', 
    'play.dugecraft.com.tr', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Skyblock']::text[], 
    false, 
    54, 
    'DugeCraft - PvP / Skyblock.'
  ),
  (
    'play.wynncraft.comOnline 1118 5868play.WYNNCRAFT.com           v2.2.0 ✦FRUMA IS ', 
    'wynncraft.com', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    49, 
    'play.wynncraft.comOnline 1118 5868play.WYNNCRAFT.com           v2.2.0 ✦FRUMA IS  - PvP server.'
  ),
  (
    'blocksmc.comOnline 1181 365✴ BlocksMC ✴NEW GAME: Pillars of Fortune', 
    'blocksmc.com', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    41, 
    'blocksmc.comOnline 1181 365✴ BlocksMC ✴NEW GAME: Pillars of Fortune - PvP server.'
  ),
  (
    'play.loverfella.comOnline 507 228❤ LOVERCRAFT ❤ - NEW sURVIVAL sEAsON!▶ SURVIVAL', 
    'loverfella.com', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    40, 
    'play.loverfella.comOnline 507 228❤ LOVERCRAFT ❤ - NEW sURVIVAL sEAsON!▶ SURVIVAL - PvP server.'
  ),
  (
    'play.cubecraft.netOnline 1133 915               ⏴ CUBECRAFT GAMES [NA] ⏵        ', 
    'cubecraft.net', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    36, 
    'play.cubecraft.netOnline 1133 915               ⏴ CUBECRAFT GAMES [NA] ⏵         - PvP server.'
  ),
  (
    'Twenture Network | mp.twenture.net', 
    'mp.twenture.net', 
    25565, 
    '1.21.11', 
    ARRAY['PvP', 'Survival', 'Skyblock', 'Lifesteal']::text[], 
    false, 
    35, 
    'Twenture Network | mp.twenture.net - PvP / Survival / Skyblock.'
  ),
  (
    'LifeSteal SMP', 
    'mp.lifestealsmp.com', 
    25565, 
    '1.21.10', 
    ARRAY['PvP', 'Survival', 'Lifesteal']::text[], 
    false, 
    27, 
    'LifeSteal SMP - PvP / Survival / Lifesteal.'
  ),
  (
    'hot.clubcraft.net', 
    'hot.clubcraft.net', 
    25565, 
    '26.1', 
    ARRAY['PvP', 'KitPvP', 'Prison', 'Survival', 'Skyblock', 'Lifesteal']::text[], 
    false, 
    25, 
    'hot.clubcraft.net - PvP / KitPvP / Prison.'
  )
ON CONFLICT (ip) DO NOTHING;

INSERT INTO servers (name, ip, port, version, tags, verified, vote_count, description)
VALUES
  (
    'mineland.netOnline 1064 96|| Mineland Network » 1.8-1.21.11   [PvP 1.8]    BEDWA', 
    'mineland.net', 
    25565, 
    '1.21', 
    ARRAY['PvP']::text[], 
    false, 
    6, 
    'mineland.netOnline 1064 96|| Mineland Network » 1.8-1.21.11   [PvP 1.8]    BEDWA - PvP server.'
  )
ON CONFLICT (ip) DO NOTHING;

