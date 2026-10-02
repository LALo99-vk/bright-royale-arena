/**
 * Snapshot of the Bright Battle Royale 2026 player auction (18 Sep 2026),
 * taken from the auction Google Sheet once every player was sold.
 * Regenerate from the sheet's Setup and Auction Log tabs if anything changes.
 */
export type AuctionSale = { n: number; player: string; team: string; price: number; round: string; batch: number };

export const auctionSetup = {
  purse: 1000000,
  basePrice: 10000,
  date: "18 Sep 2026",
};

export const auctionTeams: { name: string; captains: string[] }[] = [
  {
    "name": "Wildfire Wolves",
    "captains": [
      "Ranjan Poojari",
      "Sweta Gour"
    ]
  },
  {
    "name": "Raging Ravens",
    "captains": [
      "Sarthak Jain",
      "Rekha R"
    ]
  },
  {
    "name": "Savage Sharks",
    "captains": [
      "Ankur Varshney",
      "Anusha SG"
    ]
  },
  {
    "name": "Bulldozing Bulls",
    "captains": [
      "Shivam Verma",
      "Chhaya Koram"
    ]
  }
];

export const auctionSales: AuctionSale[] = [
  { n: 1, player: "Ayush Omer", team: "Bulldozing Bulls", price: 20000, round: "Auction", batch: 1 },
  { n: 2, player: "Priyanka P V", team: "Wildfire Wolves", price: 35000, round: "Auction", batch: 1 },
  { n: 3, player: "Saurav Patel", team: "Raging Ravens", price: 50000, round: "Auction", batch: 1 },
  { n: 4, player: "Kalpit Arya", team: "Raging Ravens", price: 80000, round: "Auction", batch: 1 },
  { n: 5, player: "Dudekula Mahamood Sa", team: "Wildfire Wolves", price: 30000, round: "Auction", batch: 1 },
  { n: 6, player: "Bill Clifferd", team: "Bulldozing Bulls", price: 45000, round: "Auction", batch: 1 },
  { n: 7, player: "Aditi Maheshwari", team: "Wildfire Wolves", price: 15000, round: "Auction", batch: 1 },
  { n: 8, player: "Chaitra C", team: "Savage Sharks", price: 15000, round: "Auction", batch: 1 },
  { n: 9, player: "Prerna Chaurasia", team: "Savage Sharks", price: 20000, round: "Auction", batch: 1 },
  { n: 10, player: "Sanju Kumari", team: "Raging Ravens", price: 50000, round: "Auction", batch: 1 },
  { n: 11, player: "Roushan", team: "Raging Ravens", price: 150000, round: "Auction", batch: 1 },
  { n: 12, player: "Bharath T", team: "Bulldozing Bulls", price: 60000, round: "Auction", batch: 1 },
  { n: 13, player: "Varun S", team: "Savage Sharks", price: 80000, round: "Auction", batch: 1 },
  { n: 14, player: "Dibyadarshini Mohanty", team: "Raging Ravens", price: 10000, round: "Auction", batch: 1 },
  { n: 15, player: "Jeevan Poonacha", team: "Wildfire Wolves", price: 150000, round: "Auction", batch: 1 },
  { n: 16, player: "Pavan Cherukuri", team: "Bulldozing Bulls", price: 20000, round: "Auction", batch: 1 },
  { n: 17, player: "Nancy Nayantika", team: "Bulldozing Bulls", price: 10000, round: "Auction", batch: 1 },
  { n: 18, player: "Tanish Singh Chouhan", team: "Savage Sharks", price: 50000, round: "Auction", batch: 1 },
  { n: 19, player: "Vasu Kapasiya", team: "Wildfire Wolves", price: 30000, round: "Auction", batch: 1 },
  { n: 20, player: "Vedant Singh Baghel", team: "Wildfire Wolves", price: 50000, round: "Auction", batch: 1 },
  { n: 21, player: "Prashanth", team: "Bulldozing Bulls", price: 60000, round: "Auction", batch: 1 },
  { n: 22, player: "Gyanbardhan", team: "Bulldozing Bulls", price: 60000, round: "Auction", batch: 1 },
  { n: 23, player: "Adithya Surasgar", team: "Savage Sharks", price: 45000, round: "Auction", batch: 1 },
  { n: 24, player: "Nikhil Gokhale", team: "Wildfire Wolves", price: 60000, round: "Auction", batch: 1 },
  { n: 25, player: "Huzaif Ahmed Shariff", team: "Bulldozing Bulls", price: 10000, round: "Auction", batch: 1 },
  { n: 26, player: "Hirok Deb", team: "Savage Sharks", price: 40000, round: "Auction", batch: 1 },
  { n: 27, player: "Prasang Maheshwari", team: "Raging Ravens", price: 20000, round: "Auction", batch: 1 },
  { n: 28, player: "Shraddha Mehta", team: "Savage Sharks", price: 35000, round: "Auction", batch: 1 },
  { n: 29, player: "yash dhawan", team: "Raging Ravens", price: 10000, round: "Auction", batch: 1 },
  { n: 30, player: "Ananya H S", team: "Raging Ravens", price: 10000, round: "Auction", batch: 1 },
  { n: 31, player: "Sam P", team: "Wildfire Wolves", price: 15000, round: "Auction", batch: 1 },
  { n: 32, player: "Anusha Ramesh", team: "Savage Sharks", price: 10000, round: "Auction", batch: 1 },
  { n: 33, player: "Madhusudan", team: "Wildfire Wolves", price: 215000, round: "Auction", batch: 2 },
  { n: 34, player: "Raaj", team: "Bulldozing Bulls", price: 35000, round: "Auction", batch: 2 },
  { n: 35, player: "Sameeksha Goyal", team: "Savage Sharks", price: 10000, round: "Auction", batch: 2 },
  { n: 36, player: "Rupal Sharma", team: "Wildfire Wolves", price: 40000, round: "Auction", batch: 2 },
  { n: 37, player: "Rakshith", team: "Savage Sharks", price: 45000, round: "Auction", batch: 2 },
  { n: 38, player: "Megha Gurudas", team: "Wildfire Wolves", price: 60000, round: "Auction", batch: 2 },
  { n: 39, player: "Sumedh Shekhar", team: "Bulldozing Bulls", price: 50000, round: "Auction", batch: 2 },
  { n: 40, player: "Akarsh Tripathi", team: "Savage Sharks", price: 15000, round: "Auction", batch: 2 },
  { n: 41, player: "Sagar Naidu", team: "Savage Sharks", price: 50000, round: "Auction", batch: 2 },
  { n: 42, player: "Yasharth Dubey", team: "Raging Ravens", price: 20000, round: "Auction", batch: 2 },
  { n: 43, player: "Rahul Tripathi", team: "Raging Ravens", price: 70000, round: "Auction", batch: 2 },
  { n: 44, player: "Vaishali Ghosh", team: "Raging Ravens", price: 15000, round: "Auction", batch: 2 },
  { n: 45, player: "Deekshith", team: "Bulldozing Bulls", price: 30000, round: "Auction", batch: 2 },
  { n: 46, player: "Biren", team: "Bulldozing Bulls", price: 80000, round: "Auction", batch: 2 },
  { n: 47, player: "shreyash", team: "Raging Ravens", price: 40000, round: "Auction", batch: 2 },
  { n: 48, player: "Snehil Verma", team: "Savage Sharks", price: 155000, round: "Auction", batch: 2 },
  { n: 49, player: "Sukhmanpreet Kaur", team: "Bulldozing Bulls", price: 25000, round: "Auction", batch: 2 },
  { n: 50, player: "Nikitha Kuppili", team: "Raging Ravens", price: 20000, round: "Auction", batch: 2 },
  { n: 51, player: "Gaurav Kumar", team: "Bulldozing Bulls", price: 90000, round: "Auction", batch: 2 },
  { n: 52, player: "Chiranjeev Singh", team: "Raging Ravens", price: 50000, round: "Auction", batch: 2 },
  { n: 53, player: "Prem Kumar M", team: "Wildfire Wolves", price: 30000, round: "Auction", batch: 2 },
  { n: 54, player: "Smriti Parmar", team: "Wildfire Wolves", price: 10000, round: "Auction", batch: 2 },
  { n: 55, player: "Praveen B", team: "Bulldozing Bulls", price: 60000, round: "Auction", batch: 2 },
  { n: 56, player: "Harshita Singh", team: "Savage Sharks", price: 10000, round: "Auction", batch: 2 },
  { n: 57, player: "Saneha Sharma", team: "Wildfire Wolves", price: 10000, round: "Re-bid", batch: 2 },
  { n: 58, player: "Soumitra Shukla", team: "Raging Ravens", price: 15000, round: "Re-bid", batch: 2 },
  { n: 59, player: "Shruti Ekbote", team: "Wildfire Wolves", price: 10000, round: "Re-bid", batch: 2 },
  { n: 60, player: "Ritika Giri", team: "Savage Sharks", price: 10000, round: "Re-bid", batch: 2 },
  { n: 61, player: "Mahendra Bhama", team: "Raging Ravens", price: 15000, round: "Auction", batch: 3 },
  { n: 62, player: "Himanshu Gupta", team: "Wildfire Wolves", price: 10000, round: "Auction", batch: 3 },
  { n: 63, player: "Ananya. J", team: "Wildfire Wolves", price: 10000, round: "Auction", batch: 3 },
  { n: 64, player: "Vangala Aryan", team: "Raging Ravens", price: 20000, round: "Auction", batch: 3 },
  { n: 65, player: "Akash kumar r", team: "Savage Sharks", price: 80000, round: "Auction", batch: 3 },
  { n: 66, player: "Ayush Kumar", team: "Raging Ravens", price: 20000, round: "Auction", batch: 3 },
  { n: 67, player: "Tanishq A.", team: "Raging Ravens", price: 50000, round: "Auction", batch: 3 },
  { n: 68, player: "Atharva Sunil Nagore", team: "Raging Ravens", price: 40000, round: "Auction", batch: 3 },
  { n: 69, player: "Shobhit Gupta", team: "Bulldozing Bulls", price: 15000, round: "Auction", batch: 3 },
  { n: 70, player: "Tushar", team: "Bulldozing Bulls", price: 20000, round: "Auction", batch: 3 },
  { n: 71, player: "Tushar Agarwal", team: "Raging Ravens", price: 20000, round: "Auction", batch: 3 },
  { n: 72, player: "Kartik Moyal", team: "Bulldozing Bulls", price: 25000, round: "Auction", batch: 3 },
  { n: 73, player: "Sudheer", team: "Wildfire Wolves", price: 25000, round: "Auction", batch: 3 },
  { n: 74, player: "Ayur Khare", team: "Savage Sharks", price: 80000, round: "Auction", batch: 3 },
  { n: 75, player: "Tanuja Addedar", team: "Savage Sharks", price: 10000, round: "Auction", batch: 3 },
  { n: 76, player: "Kathiravan", team: "Bulldozing Bulls", price: 15000, round: "Auction", batch: 3 },
  { n: 77, player: "Puneeth Sai", team: "Raging Ravens", price: 25000, round: "Auction", batch: 3 },
  { n: 78, player: "Akhil J", team: "Bulldozing Bulls", price: 25000, round: "Auction", batch: 3 },
  { n: 79, player: "Prasanna", team: "Raging Ravens", price: 45000, round: "Auction", batch: 3 },
  { n: 80, player: "Ramkumar", team: "Bulldozing Bulls", price: 35000, round: "Auction", batch: 3 },
  { n: 81, player: "Hardik Agarwal", team: "Wildfire Wolves", price: 10000, round: "Auction", batch: 3 },
  { n: 82, player: "Ridhiman Sabharwal", team: "Wildfire Wolves", price: 15000, round: "Auction", batch: 3 },
  { n: 83, player: "Rehan", team: "Bulldozing Bulls", price: 210000, round: "Auction", batch: 3 },
  { n: 84, player: "Madhu", team: "Wildfire Wolves", price: 20000, round: "Auction", batch: 3 },
  { n: 85, player: "Achyuta", team: "Savage Sharks", price: 170000, round: "Auction", batch: 3 },
  { n: 86, player: "Anshul Warade", team: "Wildfire Wolves", price: 15000, round: "Auction", batch: 3 },
  { n: 87, player: "Kartik Tyagi", team: "Savage Sharks", price: 10000, round: "Auction", batch: 3 },
  { n: 88, player: "Varun Sanjay Bhutada", team: "Savage Sharks", price: 10000, round: "Auction", batch: 3 },
  { n: 89, player: "Daulat Ojha", team: "Savage Sharks", price: 10000, round: "Auction", batch: 3 },
];
