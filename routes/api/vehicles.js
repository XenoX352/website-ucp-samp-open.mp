const express = require('express');
const router = express.Router();
const pool = require('../../database');
const requireAuth = require('../../middleware/auth');

function getVehicleName(modelId) {
  const names = {
    400: 'Landstalker', 401: 'Bravura', 402: 'Buffalo', 403: 'Linerunner', 404: 'Perennial',
    405: 'Sentinel', 406: 'Dumper', 407: 'Firetruck', 408: 'Trashmaster', 409: 'Stretch',
    410: 'Manana', 411: 'Infernus', 412: 'Voodoo', 413: 'Pony', 414: 'Mule',
    415: 'Cheetah', 416: 'Ambulance', 417: 'Leviathan', 418: 'Moonbeam', 419: 'Esperanto',
    420: 'Taxi', 421: 'Washington', 422: 'Bobcat', 423: 'Mr Whoopee', 424: 'BF Injection',
    425: 'Hunter', 426: 'Premier', 427: 'Enforcer', 428: 'Securicar', 429: 'Banshee',
    430: 'Predator', 431: 'Bus', 432: 'Rhino', 433: 'Barracks', 434: 'Hotknife',
    435: 'Article Trailer', 436: 'Previon', 437: 'Coach', 438: 'Cabbie', 439: 'Stallion',
    440: 'Rumpo', 441: 'RC Bandit', 442: 'Romero', 443: 'Packer', 444: 'Monster',
    445: 'Admiral', 446: 'Squalo', 447: 'Seasparrow', 448: 'Pizzaboy', 449: 'Tram',
    450: 'Article Trailer 2', 451: 'Turismo', 452: 'Speeder', 453: 'Reefer', 454: 'Tropic',
    455: 'Flatbed', 456: 'Yankee', 457: 'Caddy', 458: 'Solair', 459: 'Berkley\'s RC Van',
    460: 'Skimmer', 461: 'PCJ-600', 462: 'Faggio', 463: 'Freeway', 464: 'RC Baron',
    465: 'RC Raider', 466: 'Glendale', 467: 'Oceanic', 468: 'Sanchez', 469: 'Sparrow',
    470: 'Patriot', 471: 'Quad', 472: 'Coastguard', 473: 'Dinghy', 474: 'Hermes',
    475: 'Sabre', 476: 'Rustler', 477: 'ZR-350', 478: 'Walton', 479: 'Regina',
    480: 'Comet', 481: 'BMX', 482: 'Burrito', 483: 'Camper', 484: 'Marquis',
    485: 'Baggage', 486: 'Dozer', 487: 'Maverick', 488: 'News Chopper', 489: 'Rancher',
    490: 'FBI Rancher', 491: 'Virgo', 492: 'Greenwood', 493: 'Jetmax', 494: 'Hotring',
    495: 'Sandking', 496: 'Blista Compact', 497: 'Police Maverick', 498: 'Boxville', 499: 'Benson',
    500: 'Mesa', 501: 'RC Goblin', 502: 'Hotring Racer A', 503: 'Hotring Racer B', 504: 'Bloodring Banger',
    505: 'Rancher Lure', 506: 'Super GT', 507: 'Elegant', 508: 'Journey', 509: 'Bike',
    510: 'Mountain Bike', 511: 'Beagle', 512: 'Cropdust', 513: 'Stunt', 514: 'Tanker',
    515: 'Roadtrain', 516: 'Nebula', 517: 'Majestic', 518: 'Buccaneer', 519: 'Shamal',
    520: 'Hydra', 521: 'FCR-900', 522: 'NRG-500', 523: 'HPV1000', 524: 'Cement Truck',
    525: 'Tow Truck', 526: 'Fortune', 527: 'Cadrona', 528: 'FBI Truck', 529: 'Willard',
    530: 'Forklift', 531: 'Tractor', 532: 'Combine', 533: 'Feltzer', 534: 'Remington',
    535: 'Slamvan', 536: 'Blade', 537: 'Freight', 538: 'Streak', 539: 'Vortex',
    540: 'Vincent', 541: 'Bullet', 542: 'Clover', 543: 'Sadler', 544: 'Firetruck LA',
    545: 'Hustler', 546: 'Intruder', 547: 'Primo', 548: 'Cargobob', 549: 'Tampa',
    550: 'Sunrise', 551: 'Merit', 552: 'Utility', 553: 'Nevada', 554: 'Yosemite',
    555: 'Windsor', 556: 'Monster A', 557: 'Monster B', 558: 'Uranus', 559: 'Jester',
    560: 'Sultan', 561: 'Stratum', 562: 'Elegy', 563: 'Raindance', 564: 'RC Tiger',
    565: 'Flash', 566: 'Tahoma', 567: 'Savanna', 568: 'Bandito', 569: 'Freight Flat',
    570: 'Streak Carriage', 571: 'Kart', 572: 'Mower', 573: 'Duneride', 574: 'Sweeper',
    575: 'Broadway', 576: 'Tornado', 577: 'AT-400', 578: 'DFT-30', 579: 'Huntley',
    580: 'Stafford', 581: 'BF-400', 582: 'Newsvan', 583: 'Tug', 584: 'Petro Trailer',
    585: 'Emperor', 586: 'Wayfarer', 587: 'Euros', 588: 'Hotdog', 589: 'Club',
    590: 'Freight Box', 591: 'Article Trailer 3', 592: 'Andromada', 593: 'Dodo', 594: 'RC Cam',
    595: 'Launch', 596: 'Police Car (LSPD)', 597: 'Police Car (SFPD)', 598: 'Police Car (LVPD)', 599: 'Police Ranger',
    600: 'Picador', 601: 'S.W.A.T. Van', 602: 'Alpha', 603: 'Phoenix', 604: 'Glendale Shit',
    605: 'Sadler Shit', 606: 'Luggage Trailer A', 607: 'Luggage Trailer B', 608: 'Stair Trailer', 609: 'Boxville',
    610: 'Farm Plow', 611: 'Utility Trailer'
  };
  return names[modelId] || 'Unknown Vehicle';
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const [vehicles] = await pool.query(
      `SELECT v.*, c.Name as owner_name FROM vehicle v 
       JOIN characters c ON v.vehOwner = c.pID 
       WHERE c.UCP = ?`,
      [req.user.UCP]
    );
    res.json({ vehicles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const [vehRows] = await pool.query(
      `SELECT v.*, c.Name as owner_name FROM vehicle v 
       JOIN characters c ON v.vehOwner = c.pID 
       WHERE v.vehID = ? AND c.UCP = ?`,
      [vehicleId, req.user.UCP]
    );
    if (vehRows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });

    const vehicle = vehRows[0];
    vehicle.vehicleName = getVehicleName(vehicle.vehModel);
    vehicle.vehX_parsed = parseFloat(vehicle.vehX).toFixed(4);
    vehicle.vehY_parsed = parseFloat(vehicle.vehY).toFixed(4);
    vehicle.vehZ_parsed = parseFloat(vehicle.vehZ).toFixed(4);
    vehicle.vehA_parsed = parseFloat(vehicle.vehA).toFixed(2);
    vehicle.vehHealth_num = parseFloat(vehicle.vehHealth).toFixed(0);
    vehicle.vehFuel_num = parseFloat(vehicle.vehFuel).toFixed(0);
    vehicle.vehColor1_hex = vehicle.vehColor1.toString(16).padStart(6, '0');
    vehicle.vehColor2_hex = vehicle.vehColor2.toString(16).padStart(6, '0');
    vehicle.vehCreated_formatted = new Date(vehicle.vehCreated).toLocaleString();
    vehicle.vehInsuTime_formatted = vehicle.vehInsuTime ? new Date(vehicle.vehInsuTime * 1000).toLocaleDateString() : 'N/A';
    vehicle.vehRentalTime_formatted = vehicle.vehRentalTime ? new Date(vehicle.vehRentalTime * 1000).toLocaleDateString() : 'N/A';

    const [trunk] = await pool.query('SELECT * FROM vehicle_trunk WHERE vehID = ?', [vehicleId]);

    res.json({ vehicle, trunk });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;