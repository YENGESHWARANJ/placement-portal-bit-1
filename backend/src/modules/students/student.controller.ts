import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserRole } from "../auth/auth.types";
import { generateAccessToken } from "../auth/auth.service";
import User from "../users/user.model";
import Student from "./student.model";
import Job from "../jobs/job.model";
import GlobalJob from "../jobs/global-job.model";
import { AuthRequest } from "../../middleware/auth.middleware";
import { logActivity } from "../activity/activity.controller";
import { onlineUsers } from "../../config/socket.config";

interface RegisterStudentBody {
  email: string;
  password: string;
  name: string;
  skills?: string[];
  branch: string;
  year: number;
  usn: string;
  cgpa?: number;
  status?: string;
  company?: string;
}

export const registerStudent = async (
  req: Request<{}, {}, RegisterStudentBody>,
  res: Response
) => {
  try {
    const {
      email,
      password,
      name,
      skills = [],
      branch,
      year,
      usn,
      cgpa,
      status,
      company
    } = req.body;

    if (!email || !password || !name || !branch || !year || !usn) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.STUDENT,
    });

    const student = await Student.create({
      userId: user._id,
      name,
      skills,
      branch,
      year,
      usn,
      cgpa,
      status,
      company
    });

    const token = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return res.status(201).json({
      message: "Student registered successfully",
      token,
      student,
    });
  } catch (error) {
    console.error("REGISTER STUDENT ERROR:", error);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const branch = req.query.branch as string;
    const status = req.query.status as string;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { usn: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } }
      ];
    }
    if (branch && branch !== "All") query.branch = branch;
    if (status && status !== "All") query.status = status;

    const students = await Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalItems = await Student.countDocuments(query);

    // Provide mock demo data if database is empty/offline
    if (students.length === 0) {
      const mockStudents = Array.from({ length: 12 }).map((_, i) => ({
        _id: `mock_id_${i}`,
        userId: `mock_user_${i}`,
        name: ["Arun Kumar", "Priya Sharma", "Vijay Singh", "Deepa Rani", "Rahul Dev", "Anjali Menon", "Karthik Raj", "Sneha K", "Rohit M", "Meera V", "Akash P", "Divya S"][i],
        email: `student${i}@bitsathy.ac.in`,
        usn: `BIT2024CS${i.toString().padStart(3, '0')}`,
        branch: ["CSE", "ECE", "ISE", "EEE", "MECH", "AI&DS"][i % 6],
        cgpa: parseFloat((8.0 + Math.random() * 1.8).toFixed(2)),
        status: ["Unplaced", "Placed", "Offers Received", "Unplaced", "Placed", "Placed"][i % 6],
        skills: ["React", "Python", "Java", "C++", "Node.js", "MongoDB", "AWS"].sort(() => 0.5 - Math.random()).slice(0, 3)
      }));

      // Basic filtering for mock data
      const filteredMocks = mockStudents.filter(s => 
         (branch === "All" || !branch || s.branch === branch) &&
         (status === "All" || !status || s.status === status) &&
         (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.skills.join(" ").toLowerCase().includes(search.toLowerCase()))
      );

      return res.status(200).json({
        students: filteredMocks,
        totalPages: 1,
        currentPage: 1,
        totalItems: filteredMocks.length
      });
    }

    return res.status(200).json({
      students,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      totalItems
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

export const getPlacedStudents = async (req: Request, res: Response) => {
  try {
    const placedStudents = await Student.find({ status: "Placed" })
      .select("_id name branch year company profilePicture")
      .sort({ updatedAt: -1 })
      .limit(10);
    return res.json({ success: true, data: placedStudents });
  } catch (error) {
    console.error("GET PLACED STUDENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch placed students" });
  }
};

export const getOnlineStudents = async (req: Request, res: Response) => {
  try {
    const onlineUserIds = Array.from(onlineUsers);
    return res.json({ onlineUserIds });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch online statuses" });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Student ID" });
    }

    const student = await Student.findById(id).populate('userId', 'email role');

    if (!student) {
      // Return a mock dossier to prevent UI crash when clicking alumni in dev/demo mode
      return res.json({ 
        student: {
          _id: id,
          name: "Mock Alumni Candidate",
          email: "alumni@bitsathy.ac.in",
          branch: "CSE",
          year: 2024,
          usn: "DEMO_" + id.substring(0,6),
          cgpa: 9.2,
          skills: ["React", "Express", "Node.js", "MongoDB"],
          about: "This is a mock profile loaded because the database record does not exist or isn't connected. It simulates an elite placed candidate profile.",
          company: "Elite Corporation",
          status: "Placed",
          aptitudeScore: 95,
          codingScore: 92,
          interviewScore: 90
        } 
      });
    }

    return res.json({ student });
  } catch (error) {
    console.error("GET STUDENT BY ID ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch student profile" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(200).json({
        success: true,
        message: "Running in mock mode. Profile changes not persisted in DB.",
        data: { ...req.body, _id: userId }
      });
    }

    const {
      skills, name, resumeScore,
      branch, year, usn, cgpa, status, company,
      about, linkedin, github, website, leetcode, hackerrank, profilePicture, location
    } = req.body;

    let student = await Student.findOne({ userId });

    if (student) {
      if (name) {
        student.name = name;
        await User.findByIdAndUpdate(userId, { name });
      }
      if (skills) student.skills = skills;
      if (resumeScore !== undefined) student.resumeScore = resumeScore;
      if (branch) student.branch = branch;
      if (year) student.year = year;
      if (usn) student.usn = usn;
      if (cgpa !== undefined) student.cgpa = cgpa;
      if (status) student.status = status;
      if (company !== undefined) student.company = company;
      if (about !== undefined) student.about = about;
      if (linkedin !== undefined) student.linkedin = linkedin;
      if (github !== undefined) student.github = github;
      if (website !== undefined) student.website = website;
      if (leetcode !== undefined) student.leetcode = leetcode;
      if (hackerrank !== undefined) student.hackerrank = hackerrank;
      if (profilePicture !== undefined) student.profilePicture = profilePicture;
      if (location !== undefined) student.location = location;

      await student.save();
    } else {
      const user = await User.findById(userId);

      student = await Student.create({
        userId,
        name: name || user?.name || "Student",
        usn: usn || "PENDING-" + userId.toString().substring(0, 6).toUpperCase(),
        branch: branch || "General",
        year: year || 2025,
        skills: skills || [],
        resumeScore: resumeScore || 0,
        cgpa: cgpa || 0,
        status: status || "Unplaced",
        company: company || null,
        about: about || "",
        linkedin: linkedin || "",
        github: github || "",
        website: website || "",
        leetcode: leetcode || "",
        hackerrank: hackerrank || "",
        profilePicture: profilePicture || "",
        location: location || "Sathy, Tamil Nadu"
      });
    }

    await logActivity(userId!, "Update Profile", "Updated Student Profile Details");

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      data: student
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({
        success: true,
        data: {
          name: "Mock Student",
          email: "mock@gmail.com",
          skills: ["JavaScript", "React"],
          status: "Unplaced"
        }
      });
    }

    let student = await Student.findOne({ userId });

    if (!student) {
      const user = await User.findById(userId);
      return res.json({
        success: true,
        data: {
          name: user?.name || "Student",
          email: user?.email,
          skills: [],
          status: "Unplaced"
        }
      });
    }

    return res.json({ success: true, data: student });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const student = await Student.findOne({ userId });
    if (!student) return res.json({ savedJobs: [] });

    const savedIds = student.savedJobIds || [];

    const internalJobs = await Job.find({ _id: { $in: savedIds } }).select("title company location type salary apply_url");
    const globalJobs = await GlobalJob.find({ _id: { $in: savedIds } }).select("title company location type salary apply_url source");

    const allSavedJobs = [...internalJobs, ...globalJobs];

    const savedJobs = allSavedJobs.map((j: any) => ({
      id: j._id?.toString(),
      title: j.title || "Untitled",
      company: j.company || "Unknown",
      location: j.location || "Remote",
      type: j.type || "Remote/Full-time",
      salary: j.salary || "Negotiable",
      apply_url: j.apply_url,
      source: j.source || 'Internal'
    }));

    return res.json({ savedJobs });
  } catch (error) {
    console.error("GET SAVED JOBS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};

export const addSavedJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.body;
    if (!userId || !jobId) return res.status(400).json({ message: "jobId required" });

    let job: any = await Job.findById(jobId);
    if (!job) {
      job = await GlobalJob.findById(jobId);
    }
    if (!job) return res.status(404).json({ message: "Job not found" });

    let student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: "Student profile not found" });

    if (!student.savedJobIds) student.savedJobIds = [];
    if (student.savedJobIds.some((id: any) => id.toString() === jobId)) {
      return res.json({ message: "Already saved", savedJobs: student.savedJobIds });
    }
    student.savedJobIds.push(job._id);
    await student.save();
    return res.json({ message: "Job saved", savedJobs: student.savedJobIds });
  } catch (error) {
    console.error("ADD SAVED JOB ERROR:", error);
    return res.status(500).json({ message: "Failed to save job" });
  }
};


export const removeSavedJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.params;
    if (!userId || !jobId) return res.status(400).json({ message: "jobId required" });

    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: "Student profile not found" });

    student.savedJobIds = (student.savedJobIds || []).filter((id: any) => id.toString() !== jobId);
    await student.save();
    return res.json({ message: "Job removed from saved", savedJobs: student.savedJobIds });
  } catch (error) {
    console.error("REMOVE SAVED JOB ERROR:", error);
    return res.status(500).json({ message: "Failed to remove saved job" });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await Student.aggregate([
      {
        $project: {
          name: 1,
          usn: 1,
          cgpa: 1,
          aptitudeScore: 1,
          codingScore: 1,
          interviewScore: 1,
          resumeScore: 1,
          totalScore: {
            $round: [
              {
                $add: [
                  { $multiply: [{ $ifNull: ["$aptitudeScore", 0] }, 2] },
                  { $multiply: [{ $ifNull: ["$codingScore", 0] }, 4] },
                  { $multiply: [{ $ifNull: ["$interviewScore", 0] }, 3] },
                  { $multiply: [{ $ifNull: ["$resumeScore", 0] }, 1] }
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 100 }
    ]);

    return res.json({ leaderboard });
  } catch (error) {
    console.error("GET LEADERBOARD ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

export const bulkRegisterStudents = async (req: Request, res: Response) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid students data format" });
    }

    const results = [];
    for (const studentData of students) {
      try {
        const { email, password, name, branch, year, usn, cgpa } = studentData;
        const hashedPassword = await bcrypt.hash(password || "student123", 10);

        const existingUser = await User.findOne({ email });
        if (existingUser) continue;

        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          role: UserRole.STUDENT,
        });

        const student = await Student.create({
          userId: user._id,
          name,
          skills: studentData.skills || [],
          branch,
          year,
          usn,
          cgpa,
          status: "Unplaced"
        });
        results.push(student);
      } catch (e) {
        console.error("Error registering student in bulk:", studentData.email, e);
      }
    }

    return res.status(201).json({
      message: `Successfully registered ${results.length} students`,
      count: results.length
    });
  } catch (error) {
    console.error("BULK REGISTER ERROR:", error);
    return res.status(500).json({ message: "Bulk registration failed" });
  }
};
