// Boldron Pinfold Dominoes Club - Data
const CLUB_DATA = {
    // Master player registry - ID-based so renames don't break data
    playerRegistry: [
        { id: "p1", name: "Andrea", active: true },
        { id: "p2", name: "Craig", active: true },
        { id: "p3", name: "Hayley", active: true },
        { id: "p4", name: "Jeff", active: true },
        { id: "p5", name: "Kath", active: true },
        { id: "p6", name: "Lee", active: true },
        { id: "p7", name: "Lynne", active: true },
        { id: "p8", name: "Maggie", active: true },
        { id: "p9", name: "Mark Atkinson", active: true },
        { id: "p10", name: "Mark Thompson", active: true },
        { id: "p11", name: "Mo", active: false },
        { id: "p12", name: "Ron", active: true },
        { id: "p13", name: "Trish", active: true },
        { id: "p14", name: "Duncan", active: true },
        { id: "p15", name: "Debra", active: true },
        { id: "p16", name: "Robert", active: false },
        { id: "p17", name: "Jo", active: true }
    ],

    players: [
        "Andrea", "Craig", "Hayley", "Jeff", "Kath", "Lee", "Lynne",
        "Maggie", "Mark Atkinson", "Mark Thompson", "Mo", "Ron", "Trish", "Duncan", "Debra", "Robert"
    ],

    // League Fixtures 2024-25
    fixtures_24_25: [
        { id: "fx1", date: "2024-09-02", opponent: "Bowes Club A", venue: "Home", supper: "Maggie", drivers: "", bar: "Jeff", result: "WIN" },
        { id: "fx2", date: "2024-09-09", opponent: "Bowes Club A", venue: "Away", supper: "", drivers: "Craig, Mark T", bar: "", result: "LOST" },
        { id: "fx3", date: "2024-09-16", opponent: "B.C.W.M.C", venue: "Away", supper: "", drivers: "Craig, Maggie", bar: "", result: "LOST" },
        { id: "fx4", date: "2024-09-23", opponent: "B.C.W.M.C", venue: "Home", supper: "Kath", drivers: "", bar: "Jeff", result: "LOST" },
        { id: "fx5", date: "2024-09-30", opponent: "Blue Bell", venue: "Home", supper: "Andrea", drivers: "", bar: "Hayley & Lee", result: "LOST" },
        { id: "fx6", date: "2024-10-07", opponent: "Blue Bell", venue: "Away", supper: "", drivers: "Lee, Mark A, Mark T", bar: "", result: "LOST" },
        { id: "fx7", date: "2024-10-14", opponent: "Bye", venue: "", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx8", date: "2024-10-21", opponent: "Bye", venue: "", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx9", date: "2024-10-28", opponent: "Cricketers Arms", venue: "Away", supper: "", drivers: "Jeff, Mo, Mark", bar: "", result: "WIN" },
        { id: "fx10", date: "2024-11-04", opponent: "Cricketers Arms", venue: "Home", supper: "Lynne", drivers: "", bar: "Kev", result: "LOST" },
        { id: "fx11", date: "2024-11-11", opponent: "Red Lion A", venue: "Home", supper: "Trish", drivers: "", bar: "Simon", result: "LOST" },
        { id: "fx12", date: "2024-11-18", opponent: "Red Lion A", venue: "Away", supper: "", drivers: "Mark T, Mark A, Lee", bar: "", result: "LOST" },
        { id: "fx13", date: "2024-11-25", opponent: "Langdon Beck B", venue: "Home", supper: "Maggie", drivers: "", bar: "Kev", result: "LOST" },
        { id: "fx14", date: "2024-12-02", opponent: "Langdon Beck B", venue: "Away", supper: "", drivers: "Lee, Craig", bar: "", result: "WIN" },
        { id: "fx15", date: "2024-12-09", opponent: "Red Lion B", venue: "Away", supper: "", drivers: "Lee, Craig", bar: "", result: "LOST" },
        { id: "fx16", date: "2024-12-16", opponent: "Red Lion B", venue: "Home", supper: "Andrea", drivers: "", bar: "Jeff", result: "LOST" },
        { id: "fx17", date: "2025-01-06", opponent: "Wheatsheaf A", venue: "Away", supper: "", drivers: "", bar: "", result: "WIN" },
        { id: "fx18", date: "2025-01-13", opponent: "Wheatsheaf A", venue: "Home", supper: "Hayley & Craig", drivers: "", bar: "Hayley", result: "WIN" }
    ],

    // League Fixtures 2025-26
    fixtures_25_26: [
        { id: "fx19", date: "2025-09-08", opponent: "Wheatsheaf A", venue: "Home", supper: "Lee", drivers: "", bar: "Kev", result: "LOST" },
        { id: "fx20", date: "2025-09-15", opponent: "Wheatsheaf A", venue: "Away", supper: "", drivers: "Lee & Trish", bar: "", result: "WIN" },
        { id: "fx21", date: "2025-09-22", opponent: "Middleton Club B", venue: "Away", supper: "", drivers: "Craig & Lee", bar: "", result: "LOST" },
        { id: "fx22", date: "2025-09-29", opponent: "Middleton Club B", venue: "Home", supper: "Lynne", drivers: "", bar: "Hayley", result: "WIN" },
        { id: "fx23", date: "2025-10-06", opponent: "Blue Bell", venue: "Home", supper: "Craig", drivers: "", bar: "Kev", result: "LOST" },
        { id: "fx24", date: "2025-10-13", opponent: "Blue Bell", venue: "Away", supper: "", drivers: "Craig & Jo", bar: "", result: "WIN" },
        { id: "fx25", date: "2025-10-20", opponent: "B.C.W.M.C", venue: "Away", supper: "", drivers: "Craig & Duncan", bar: "", result: "LOST" },
        { id: "fx26", date: "2025-10-27", opponent: "B.C.W.M.C", venue: "Home", supper: "Duncan", drivers: "", bar: "", result: "LOST" },
        { id: "fx27", date: "2025-11-03", opponent: "Langdon Beck B", venue: "Away", supper: "", drivers: "Craig & Mark A", bar: "", result: "WIN" },
        { id: "fx28", date: "2025-11-10", opponent: "Langdon Beck B", venue: "Home", supper: "Mark A", drivers: "", bar: "Kev", result: "LOST" },
        { id: "fx29", date: "2025-11-17", opponent: "Red Lion B", venue: "Home", supper: "", drivers: "", bar: "Kev", result: "LOST" },
        { id: "fx30", date: "2025-11-24", opponent: "Red Lion B", venue: "Away", supper: "", drivers: "Debs, Duncan", bar: "", result: "LOST" },
        { id: "fx31", date: "2025-12-01", opponent: "Bye", venue: "", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx32", date: "2025-12-08", opponent: "Bye", venue: "", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx33", date: "2025-12-15", opponent: "Black Lions", venue: "Away", supper: "", drivers: "Mark A, Mark T, Lee", bar: "", result: "LOST" },
        { id: "fx34", date: "2026-01-05", opponent: "Black Lions", venue: "Home", supper: "Debs", drivers: "", bar: "Kev", result: "LOST" },
        { id: "fx35", date: "2026-01-12", opponent: "Bowes Club A", venue: "Away", supper: "", drivers: "Jo", bar: "", result: "WIN" },
        { id: "fx36", date: "2026-01-19", opponent: "Bowes Club A", venue: "Home", supper: "Lee", drivers: "", bar: "Kev", result: "WIN" }
    ],

    // Spring Cup 24-25
    spring_cup_24_25: [
        { id: "fx37", date: "2025-01-27", opponent: "Middleton Club B", venue: "Home", supper: "Lynne", drivers: "", bar: "Kev", result: "WIN" },
        { id: "fx38", date: "2025-01-30", opponent: "Red Lion A", venue: "Away", supper: "", drivers: "Craig, Mark", bar: "", result: "LOST" },
        { id: "fx39", date: "2025-02-03", opponent: "Wheatsheaf B", venue: "Away", supper: "", drivers: "Craig, Lee", bar: "", result: "LOST" },
        { id: "fx40", date: "2025-02-10", opponent: "Bye", venue: "Away", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx41", date: "2025-02-17", opponent: "Royal Oak", venue: "Away", supper: "", drivers: "", bar: "", result: "LOST" },
        { id: "fx42", date: "2025-02-24", opponent: "BCWMC", venue: "Home", supper: "Craig", drivers: "", bar: "Kev", result: "WIN" },
        { id: "fx43", date: "2025-03-03", opponent: "Cricket Club B", venue: "Away", supper: "", drivers: "Lee, Mark A", bar: "", result: "LOST" },
        { id: "fx44", date: "2025-03-10", opponent: "Play-offs", venue: "", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx45", date: "2025-03-24", opponent: "Finals", venue: "", supper: "", drivers: "", bar: "", result: "" }
    ],

    // Spring Cup 25-26
    spring_cup_25_26: [
        { id: "fx46", date: "2026-02-02", opponent: "Red Lion A", venue: "Home", supper: "", drivers: "", bar: "", result: "LOST" },
        { id: "fx47", date: "2026-02-09", opponent: "Bye", venue: "", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx48", date: "2026-02-16", opponent: "Black Lions", venue: "Home", supper: "Mark T", drivers: "", bar: "", result: "WIN" },
        { id: "fx49", date: "2026-02-23", opponent: "Blue Bell", venue: "Away", supper: "", drivers: "", bar: "", result: "WIN" },
        { id: "fx50", date: "2026-03-02", opponent: "Cricketers Arms", venue: "Home", supper: "Jo", drivers: "", bar: "", result: "WIN" },
        { id: "fx51", date: "2026-03-09", opponent: "Middleton Club B", venue: "Away", supper: "", drivers: "Craig, Debs, Mark A", bar: "", result: "WIN" },
        { id: "fx52", date: "2026-03-16", opponent: "Bowes Club A", venue: "Away", supper: "", drivers: "", bar: "", result: "WIN" },
        { id: "fx53", date: "2026-03-23", opponent: "Play Off", venue: "", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx54", date: "2026-03-30", opponent: "Royal Oak", venue: "Away", supper: "", drivers: "", bar: "", result: "WIN" }
    ],

    // Knock Outs 24-25
    knock_outs_24_25: [
        { id: "fx55", date: "2025-02-12", opponent: "Gents Pairs (Bowes Club A)", venue: "Bowes Club", supper: "", drivers: "", bar: "", result: "WIN" },
        { id: "fx56", date: "2025-02-18", opponent: "Team Play Offs (Bowes Club A)", venue: "Bowes Club", supper: "", drivers: "", bar: "", result: "WIN" },
        { id: "fx57", date: "2025-02-26", opponent: "Captains Knock Out (Bowes Club A)", venue: "Bowes Club", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx58", date: "2025-03-04", opponent: "Team Play Offs", venue: "Pinfold", supper: "Craig", drivers: "", bar: "Hayley", result: "" },
        { id: "fx59", date: "2025-03-12", opponent: "Ladies Pairs (Blue Bell)", venue: "Middleton Club", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx60", date: "2025-03-18", opponent: "Team Play Offs (if we qualify)", venue: "Middleton Club", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx61", date: "2025-03-24", opponent: "Team Play Offs Finals", venue: "Barnard Castle Cricket Club", supper: "", drivers: "", bar: "", result: "" },
        { id: "fx62", date: "2025-03-24", opponent: "Gents Play Offs Finals", venue: "Barnard Castle Cricket Club", supper: "", drivers: "Lee", bar: "", result: "WIN" }
    ],

    // Player Stats 2024-25
    stats_24_25: [
        { name: "Andrea", gamesPlayed: 3, roundsWon: 4, winRate: 0.444 },
        { name: "Craig", gamesPlayed: 13, roundsWon: 16, winRate: 0.410 },
        { name: "Jeff", gamesPlayed: 5, roundsWon: 5, winRate: 0.333 },
        { name: "Kath", gamesPlayed: 7, roundsWon: 6, winRate: 0.286 },
        { name: "Lee", gamesPlayed: 14, roundsWon: 25, winRate: 0.595 },
        { name: "Lynne", gamesPlayed: 12, roundsWon: 17, winRate: 0.472 },
        { name: "Maggie", gamesPlayed: 10, roundsWon: 19, winRate: 0.633 },
        { name: "Mark Atkinson", gamesPlayed: 10, roundsWon: 12, winRate: 0.400 },
        { name: "Mark Thompson", gamesPlayed: 9, roundsWon: 13, winRate: 0.481 },
        { name: "Mo", gamesPlayed: 1, roundsWon: 3, winRate: 0 },
        { name: "Ron", gamesPlayed: 9, roundsWon: 12, winRate: 0.444 }
    ],

    // Player Stats 2025-26 (League + Spring Cup combined - full season)
    stats_25_26: [
        { name: "Craig", gamesPlayed: 18, roundsWon: 29, winRate: 0.537 },
        { name: "Hayley", gamesPlayed: 5, roundsWon: 7, winRate: 0.467 },
        { name: "Jo", gamesPlayed: 14, roundsWon: 17, winRate: 0.405 },
        { name: "Lee", gamesPlayed: 14, roundsWon: 18, winRate: 0.429 },
        { name: "Lynne", gamesPlayed: 17, roundsWon: 23, winRate: 0.451 },
        { name: "Mark Atkinson", gamesPlayed: 14, roundsWon: 25, winRate: 0.595 },
        { name: "Mark Thompson", gamesPlayed: 14, roundsWon: 21, winRate: 0.500 },
        { name: "Ron", gamesPlayed: 13, roundsWon: 19, winRate: 0.487 },
        { name: "Trish", gamesPlayed: 1, roundsWon: 2, winRate: 0.667 },
        { name: "Duncan", gamesPlayed: 13, roundsWon: 16, winRate: 0.410 },
        { name: "Debra", gamesPlayed: 15, roundsWon: 27, winRate: 0.600 }
    ],

    // League Table 2025-26
    leagueTable: {
        divisionA: [
            { pos: 1, team: "Royal Oak", points: 89 },
            { pos: 2, team: "Cricket Club A", points: 83 },
            { pos: 3, team: "Red Lion A", points: 82 },
            { pos: 4, team: "Bye", points: 81 },
            { pos: 5, team: "Middleton Club A", points: 81 },
            { pos: 6, team: "Cricketers Arms", points: 81 },
            { pos: 7, team: "Moorcock", points: 80 },
            { pos: 8, team: "Bowes WMC B", points: 80 },
            { pos: 9, team: "Cricket Club B", points: 80 },
            { pos: 10, team: "Langdon Beck A", points: 73 }
        ],
        divisionB: [
            { pos: 1, team: "Black Lions", points: 95 },
            { pos: 2, team: "Red Lion B", points: 87 },
            { pos: 3, team: "Blue Bell", points: 86 },
            { pos: 4, team: "B.C.W.M.C.", points: 86 },
            { pos: 5, team: "Middleton Club B", points: 83 },
            { pos: 6, team: "Bye", points: 81 },
            { pos: 7, team: "Bowes Club A", points: 75 },
            { pos: 8, team: "Wheatsheaf", points: 74 },
            { pos: 9, team: "Langdon Beck B", points: 72 },
            { pos: 10, team: "Boldron Pinfold", points: 71 }
        ]
    },

    // Finances - Income & Expenditure
    finances: {
        income: [
            { item: "Raffle", date: "2024-09-02", value: 48.00 },
            { item: "League fees", date: "2024-09-02", value: 13.50 },
            { item: "Photo comp proceeds", date: "2024-09-08", value: 18.00 },
            { item: "Raffle", date: "2024-09-23", value: 14.00 },
            { item: "Raffle", date: "2024-09-30", value: 15.00 },
            { item: "Raffle", date: "2024-11-04", value: 14.00 },
            { item: "Raffle", date: "2024-11-11", value: 13.00 },
            { item: "Raffle", date: "2024-11-25", value: 13.00 },
            { item: "Raffle", date: "2024-12-16", value: 15.00 },
            { item: "Raffle", date: "2025-01-13", value: 15.00 },
            { item: "Raffle", date: "2025-01-27", value: 13.00 },
            { item: "Raffle", date: "2025-02-24", value: 20.00 },
            { item: "Raffle", date: "2025-09-29", value: 15.00 },
            { item: "Raffle", date: "2025-10-06", value: 18.00 },
            { item: "Raffle", date: "2025-10-27", value: 15.00 },
            { item: "Raffle", date: "2025-11-10", value: 17.00 },
            { item: "Raffle", date: "2025-11-17", value: 21.00 },
            { item: "Raffle", date: "2026-01-05", value: 19.50 },
            { item: "Raffle", date: "2026-01-19", value: 18.00 },
            { item: "Raffle", date: "2026-02-02", value: 18.00 },
            { item: "Raffle", date: "2026-02-16", value: 14.00 }
        ],
        expenses: [
            { item: "Prize money", date: "2024-09-02", value: 5.00 },
            { item: "League fees", date: "2024-09-02", value: 20.00 },
            { item: "Prize money", date: "2024-09-23", value: 5.00 },
            { item: "Prize money", date: "2024-09-30", value: 5.00 },
            { item: "Prize money", date: "2024-11-04", value: 5.00 },
            { item: "Prize money", date: "2024-11-11", value: 5.00 },
            { item: "Prize money", date: "2024-11-25", value: 5.00 },
            { item: "Prize money", date: "2024-12-16", value: 5.00 },
            { item: "Prize money", date: "2025-01-13", value: 5.00 },
            { item: "Training Lee", date: "2024-11-18", value: 19.00 },
            { item: "Training Craig", date: "2024-11-18", value: 12.00 },
            { item: "Prize money", date: "2025-01-27", value: 5.00 },
            { item: "Team meal out", date: "2025-02-09", value: 80.00 },
            { item: "Prize money", date: "2025-02-24", value: 5.00 },
            { item: "League fees", date: "2025-08-27", value: 20.00 },
            { item: "Prize money", date: "2025-09-29", value: 5.00 },
            { item: "Prize money", date: "2025-10-06", value: 5.00 },
            { item: "Prize money", date: "2025-10-27", value: 5.00 },
            { item: "Prize money", date: "2025-11-10", value: 5.00 },
            { item: "Prize money", date: "2025-11-17", value: 5.00 },
            { item: "Prize money", date: "2026-01-05", value: 5.00 },
            { item: "Prize money", date: "2026-01-19", value: 5.00 },
            { item: "Prize money", date: "2026-02-02", value: 5.00 },
            { item: "Prize money", date: "2026-02-16", value: 5.00 },
            { item: "Team Celebrations", date: "2026-04-20", value: 100.00 },
            { item: "League fees", date: "2026-08-08", value: 20.00 }
        ],
        totalIncome: 367,
        totalExpenses: 366,
        currentBalance: 1
    },

    // Availability data 2025-26 (per fixture per player)
    availability_25_26: {
        "2025-09-08": { "Craig": "Available", "Hayley": "Available", "Lee": "Available", "Lynne": "Available", "Mark Atkinson": "Not Available", "Mark Thompson": "Not Available", "Ron": "Available", "Duncan": "Not Available", "Andrea": "Reserve" },
        "2025-09-15": { "Craig": "Available", "Hayley": "Reserve", "Lee": "Available", "Lynne": "Available", "Mark Atkinson": "Available", "Ron": "Available", "Trish": "Available", "Duncan": "Reserve", "Andrea": "Reserve" },
        "2025-09-22": { "Craig": "Available", "Hayley": "Not Available", "Lee": "Available", "Lynne": "Available", "Mark Atkinson": "Available", "Ron": "Available", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-09-29": { "Craig": "Available", "Hayley": "Reserve", "Lee": "Available", "Lynne": "Available", "Mark Atkinson": "Available", "Ron": "Available", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-10-06": { "Craig": "Available", "Hayley": "Available", "Lee": "Reserve", "Lynne": "Available", "Mark Atkinson": "Reserve", "Mark Thompson": "Not Available", "Ron": "Reserve", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-10-13": { "Craig": "Available", "Lee": "Not Available", "Lynne": "Available", "Mark Atkinson": "Not Available", "Mark Thompson": "Reserve", "Ron": "Available", "Duncan": "Available", "Andrea": "Not Available" },
        "2025-10-20": { "Craig": "Available", "Lee": "Not Available", "Lynne": "Available", "Mark Atkinson": "Available", "Mark Thompson": "Not Available", "Ron": "Available", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-10-27": { "Craig": "Not Available", "Lee": "Not Available", "Lynne": "Available", "Mark Atkinson": "Available", "Mark Thompson": "Available", "Ron": "Available", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-11-03": { "Craig": "Available", "Lee": "Available", "Lynne": "Reserve", "Mark Atkinson": "Available", "Mark Thompson": "Available", "Ron": "Reserve", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-11-10": { "Craig": "Available", "Hayley": "Available", "Lee": "Not Available", "Lynne": "Available", "Mark Atkinson": "Available", "Mark Thompson": "Available", "Ron": "Reserve", "Duncan": "Not Available", "Andrea": "Not Available" },
        "2025-11-17": { "Craig": "Reserve", "Lee": "Available", "Lynne": "Reserve", "Mark Atkinson": "", "Mark Thompson": "Available", "Ron": "Available", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-11-24": { "Craig": "Available", "Lee": "Not Available", "Lynne": "Available", "Mark Thompson": "Available", "Ron": "Available", "Duncan": "Available", "Andrea": "Reserve" },
        "2025-12-15": { "Craig": "Reserve", "Lee": "Available", "Lynne": "Available", "Mark Atkinson": "Available", "Mark Thompson": "Available", "Ron": "Not Available", "Andrea": "Reserve" },
        "2026-01-05": { "Craig": "Available", "Lee": "Available", "Lynne": "Available", "Mark Atkinson": "Available", "Mark Thompson": "Available", "Ron": "Not Available", "Andrea": "Reserve" },
        "2026-01-12": { "Craig": "Reserve", "Lee": "Available", "Lynne": "Available", "Mark Atkinson": "Reserve", "Ron": "Available", "Duncan": "Available", "Andrea": "Reserve" },
        "2026-01-19": { "Craig": "Available", "Lee": "Reserve", "Lynne": "Reserve", "Mark Atkinson": "Available", "Mark Thompson": "Available", "Ron": "Reserve", "Duncan": "Available", "Andrea": "Reserve" }
    }
};
