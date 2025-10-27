require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./utilities');
const User = require('./models/user.model');
const Note = require('./models/note.model');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  app.use(cors());
} else {
  app.use(cors({
    origin: ["https://your-frontend-domain.vercel.app"],
    credentials: true,
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);

async function db(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database Connected Successfully');
        app.listen(PORT, () => console.log(`Server started at ${PORT}`)); 
    }
    catch(err){
        console.error("Database connection failed", err);
        process.exit(1);
    }
}

db();


app.get('/', (req,res)=>{
    res.json({data: "hello world"});
});

// signup 
app.post('/signup',async(req,res)=>{
    console.log("🔥 BODY RECEIVED:", req.body);
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({error:true,message:"All fields are required"});
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: true, message: "Email already registered" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        fullName,
        email,
        password:hashedPassword,
    });

    await newUser.save();
    const accessToken = jwt.sign({id: newUser._id, email: newUser.email},
        process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"36000m",
    });
    console.log("New user created:",newUser);
    res.status(201).json({error:false,message:"Account created successfully",accessToken,newUser});
});

//login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        const userInfo = await User.findOne({ email });
        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, userInfo.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: true, message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: userInfo._id, email: userInfo.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3600m" }
        );
        console.log("User login successfully",userInfo);
        res.json({
            error: false,
            message: "Login successful",
            email: userInfo.email,
            accessToken,
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

//get-user
app.get('/get-user',authenticateToken,async(req,res)=>{
    const user = req.user;
    const isUser = await User.findOne({_id:user.id});

    if(!isUser){
        return res.status(401);
    }

    return res.json({
        user:{
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn,
        },
        message:"user fetched successfully",
    });  
})

//add-notes
app.post('/add-note',authenticateToken,async(req,res)=>{
    const {title, content, tags} = req.body;
    const user = req.user;
    
    if(!title || !content){
        return res.status(400).json({message:"All field is required"});
    }

    try {
        const note = new Note({
            title,
            content,
            tags:tags || [],
            userId:user.id
        });

        await note.save();
        console.log("Note added successfully:",note);
        return res.json({
            error:false,
            message:"Notes added successfully",
        });

    } catch (error) {
        return res.status(500).json({
            error:true,
            message:"Internal server error",
        });
    }
});

//update-notes
app.put('/edit-note/:noteId',authenticateToken,async(req,res)=>{
    const noteId = req.params.noteId;
    const {title,content,tags,isPinned} = req.body;
    const user = req.user;

    if(!title || !content || !tags){
        return res.status(400).
        json({error:true,message:"No change provided"});
    }

    try {
        const editNote = await Note.findOne({_id:noteId,userId:user.id});

        if(!editNote){
            return res.status(404).json({error:true,message:"Note not found"});
        }

        if (title) editNote.title = title;
        if (content) editNote.content = content;
        if (tags) editNote.tags = tags;
        if (isPinned !== undefined) editNote.isPinned = isPinned; // handle false


        await editNote.save();
        console.log("Note updated successfully:",editNote);
        return res.json({
            error:false,
            message:"Note updated successfully",
            editNote,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:true,
            message:"Internal server error",
        });
        
    }
});

//get all notes
app.get('/get-all-notes',authenticateToken,async(req,res)=>{
    const user = req.user;
    
    try {
        const notes = (await Note.find({userId:user.id}).sort({
            isPinned:-1
        }));

        return res.json({
            error:false,
            message:"successfully fetched all notes",
            notes
        })
    } catch (error) {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        });
    }
});

//Delete Note
app.delete('/delete-note/:noteId',authenticateToken,async(req,res)=>{
    const noteId = req.params.noteId;
    const user = req.user;

    try {
        const note = await Note.findOne({_id: noteId, userId: user.id});

        if(!note){
            return res.status(404).json({error: true, message:"Note not found"});
        }

        await Note.deleteOne({_id:noteId, userId:user.id});

        return res.json({
            error:false,
            message:"Note deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }
});

//updated isPinned value
app.put('/update-note-pinned/:noteId',authenticateToken,async(req,res)=>{
     const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const user = req.user;

    try {
        const editNote = await Note.findOne({_id:noteId,userId:user.id});

        if(!editNote){
            return res.status(404).json({error:true,message:"Note not found"});
        }

        // Only update if isPinned is provided (true or false)
        if (typeof isPinned === "boolean") {
            editNote.isPinned = isPinned;
        } else {
            return res.status(400).json({ error: true, message: "isPinned must be boolean" });
        }


        await editNote.save();
        console.log("Note updated successfully:",editNote);
        return res.json({
            error:false,
            message:"Note updated successfully",
            editNote,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:true,
            message:"Internal server error",
        });
        
    }
})

//Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
  const user = req.user;
  const { query } = req.query; // from frontend ?query=someword

  if (!query) {
    return res.status(400).json({
      error: true,
      message: "Search query is required",
    });
  }

  try {
    // Case-insensitive search in title or content
    const matchingNotes = await Note.find({
      userId: user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
        { tags: { $regex: new RegExp(query, "i") } },
      ],
    }).sort({ isPinned: -1, updatedAt: -1 });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    console.error("Error searching notes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});


module.exports = app;
