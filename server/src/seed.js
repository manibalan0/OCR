require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaint_db';
    const conn = await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB Host: ${conn.connection.host}`);

    await User.deleteMany({});
    await Complaint.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const agentPassword = await bcrypt.hash('agent123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@coreresolvedesk.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+1 800 555 0199',
      department: 'Administration'
    });

    const agent = await User.create({
      name: 'Alex Rivera',
      email: 'agent@coreresolvedesk.com',
      password: agentPassword,
      role: 'AGENT',
      phone: '+1 800 555 0188',
      department: 'Technical Support'
    });

    const user = await User.create({
      name: 'John User',
      email: 'user@coreresolvedesk.com',
      password: userPassword,
      role: 'USER',
      phone: '+1 800 555 0177'
    });

    await Complaint.create({
      ticketId: 'CMP-104928',
      title: 'VPN Connection Timeout Issue',
      description: 'Unable to connect to company secure VPN server from remote workstation. Keep getting error code 504 timeout.',
      category: 'Technical',
      priority: 'High',
      status: 'In Progress',
      userId: user._id,
      agentId: agent._id,
      resolutionNotes: 'Verified firewall settings. Reset auth tokens on user profile.'
    });

    await Complaint.create({
      ticketId: 'CMP-209384',
      title: 'Incorrect Monthly Subscription Charge',
      description: 'Billed twice for the enterprise license renewal during July billing cycle.',
      category: 'Billing',
      priority: 'Medium',
      status: 'Pending',
      userId: user._id
    });

    console.log('Seed database completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err.message || err);
    process.exit(1);
  }
};

seedData();
