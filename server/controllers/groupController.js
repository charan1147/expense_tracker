import Group from "../models/Group.js"; // Import the Group model
import Expense from "../models/Expense.js"; // Import the Expense model
import User from "../models/User.js"; // Import the User model

// Create a new group
export const createGroup = async (req, res) => {
  try {
    // Extract name, description, and members from request body
    const { name, description, members } = req.body;
    
    // Validate if the group name is provided
    if (!name) return res.status(400).json({ success: false, message: "Group name is required" });

    // Check if a group with the same name already exists
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) return res.status(400).json({ success: false, message: "Group name already exists" });

    // Create a set to store unique member IDs, always including the creator
    const memberIds = new Set([req.user.id]); 

    // If members are provided, find their user IDs by username or email
    if (Array.isArray(members) && members.length) {
      const foundUsers = await User.find({ 
        $or: [{ username: { $in: members } }, { email: { $in: members } }] 
      }).select("_id");

      // Add found user IDs to the set
      foundUsers.forEach(user => memberIds.add(user._id.toString()));
    }

    // Create and save the new group
    const group = await new Group({
      name,
      description,
      createdBy: req.user.id, // Store the creator's ID
      members: Array.from(memberIds), // Convert Set to Array
    }).save();

    // Send response with created group details
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Update group details (only creator can update)
export const updateGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Find and update the group only if the request user is the creator
    const group = await Group.findOneAndUpdate(
      { _id: req.params.groupId, createdBy: req.user.id },
      { name, description },
      { new: true } // Return the updated document
    );

    // If group is not found or user is unauthorized, return an error
    if (!group) return res.status(403).json({ success: false, message: "Unauthorized action" });

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Delete group (only creator can delete)
export const deleteGroup = async (req, res) => {
  try {
    // Find and delete the group only if the request user is the creator
    const group = await Group.findOneAndDelete({ _id: req.params.groupId, createdBy: req.user.id });
    
    if (!group) return res.status(403).json({ success: false, message: "Unauthorized action" });

    res.status(200).json({ success: true, message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Add expense to a group
export const addGroupExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    // Validate input fields
    if (!amount || !category || !date || isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Valid amount, category, and date are required" });
    }

    // Find the group and ensure the user is a member
    const group = await Group.findById(req.params.groupId);
    if (!group || !group.members.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized to add expenses" });
    }

    // Create and save a new expense
    const expense = await new Expense({
      userId: req.user.id,
      amount,
      category,
      date: new Date(date),
      description
    }).save();

    // Add the expense to the group's expenses array and save
    group.expenses.push(expense._id);
    await group.save();

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Get all expenses for a group
export const getGroupExpenses = async (req, res) => {
  try {
    // Find the group and populate its expenses
    const group = await Group.findById(req.params.groupId)
      .populate("expenses", "userId amount category date description");

    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    // Get expenses with user details
    const expenses = await Expense.find({ _id: { $in: group.expenses } }).populate("userId", "username");

    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("createdBy", "username email")
      .populate("members", "username email")
      .populate("expenses");

    if (!groups.length) return res.status(404).json({ success: false, message: "No groups found" });

    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Calculate expense splitting among group members
export const calculateExpenseSplitting = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "username")
      .populate({ path: "expenses", populate: { path: "userId", select: "username" } });

    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    const uniqueMembers = [...new Set(group.members.map(m => m._id.toString()))];

    // Calculate how much each member owes
    const splitResult = group.expenses.map(expense => {
      const payerId = expense.userId?._id?.toString();
      const payerUsername = expense.userId?.username || "Unknown";
      const totalAmount = Number(expense.amount);
      const sharePerMember = totalAmount / uniqueMembers.length;

      const debts = uniqueMembers
        .filter(id => id !== payerId)
        .map(id => ({ username: group.members.find(m => m._id.toString() === id).username, owes: sharePerMember }));

      return { expenseId: expense._id, description: expense.description || "No description", payer: payerUsername, totalAmount, debts };
    });

    res.json({ success: true, data: splitResult });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get group by ID
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "username")
      .populate({ path: "expenses", populate: { path: "userId", select: "username" } });

    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
