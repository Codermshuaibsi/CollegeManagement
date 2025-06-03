const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TeacherModel = require('../models/Teacher');
const StudentModel = require('../models/Student');
const DirectorModel = require('../models/Director');
const HODModel = require('../models/Hod');
const { verifyDirector } = require('../middlewares/verifyDirector');
const { verifyHod } = require('../middlewares/verifyHod');
const verifyTeacher = require('../middlewares/verifyTeacher').verifyTeacher;
const verifyToken = require('../middlewares/authMiddleware').verifyToken;
const router = express.Router();

// Register a Director

router.post('/register/director',async (req, res) => {
    const { name, email, password } = req.body;

    // Check all fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if Director already exists
        const existingDirector = await DirectorModel.findOne({ email });
        if (existingDirector) {
            return res.status(400).json({ message: 'Director already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Director
        const newDirector = new DirectorModel({
            name,
            email,
            password: hashedPassword,
            role: 'Director'
        });

        await newDirector.save();
        res.status(201).json({ message: 'Director registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// login a Director
router.post('/login/director', async (req, res) => {
    const { email, password } = req.body;
    const user = await DirectorModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });
    const token = jwt.sign(
        { id: user._id, name: user.name, role: 'Director' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    res.json({ message: 'Login success', token });

})

//Register a HOD 
router.post('/register/hod', verifyDirector, async (req, res) => {
    const { name, email, password, department, city, state, age, dueSalary, totalSalary } = req.body;

    // Check all fields are present
    if (!name || !email || !password || !department || !city || !state || !age || totalSalary == null || dueSalary == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if HOD already exists
        const existingHOD = await HODModel.findOne({ email });
        if (existingHOD) {
            return res.status(400).json({ message: 'HOD already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new HOD
        const newHOD = new HODModel({
            name,
            email,
            password: hashedPassword,
            department,
            city,
            state,
            age,
            totalSalary,
            dueSalary
        });

        await newHOD.save();
        res.status(201).json({ message: 'HOD registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in registering HOD' });
    }
});

// Login HOD Route
router.post('/login/hod', async (req, res) => {
    const { email, password } = req.body;
    const user = await HODModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });
    const token = jwt.sign(
        { id: user._id, name: user.name, role: 'HOD' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    res.json({ message: 'Login success', token });
});

// Salary Update Route for HOD
router.put('/update/hod-salary/:id', verifyDirector, async (req, res) => {
    const { id } = req.params;
    const { totalSalary, dueSalary } = req.body;

    try {
        const hod = await HODModel.findById(id);
        if (!hod) {
            return res.status(404).json({ message: 'HOD not found' });
        }

        // Update salary details
        hod.totalSalary = totalSalary;
        hod.dueSalary = dueSalary;

        await hod.save();
        res.json({ message: 'HOD salary updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in updating HOD salary' });
    }
});

// Get All HODs Route
router.get('/all/hods', verifyDirector, async (req, res) => {
    try {
        const hods = await HODModel.find();
        res.json(hods);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in fetching HODs' });
    }
});

// Delete HOD Route
router.delete('/delete/hod/:id', verifyDirector, async (req, res) => {
    const { id } = req.params;
    try {
        const hod = await HODModel.findByIdAndDelete(id);
        if (!hod) {
            return res.status(404).json({ message: 'HOD not found' });
        }
        res.json({ message: 'HOD deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in deleting HOD' });
    }
});

// Register a Teacher
router.post('/register/teacher',verifyHod, async (req, res) => {
    const {
        name,
        email,
        password,
        department,
        city,
        state,
        age,
        totalSalary,
        dueSalary,
        subjects
    } = req.body;

    // Check all fields are present
    if (!name || !email || !password || !department || !city || !state || !age ||
        totalSalary == null || dueSalary == null || !subjects) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if teacher already exists
        const existingTeacher = await TeacherModel.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new teacher
        const newTeacher = new TeacherModel({
            name,
            email,
            password: hashedPassword,
            role: 'Teacher',
            department,
            city,
            state,
            age,
            totalSalary,
            dueSalary,
            subjects
        });

        await newTeacher.save();

        res.status(201).json({
            message: 'Teacher registered successfully',
            user: newTeacher
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in teacher registration' });
    }
});



// Login Teacher Route
router.post('/login/teacher', async (req, res) => {
    const { email, password } = req.body;
    const user = await TeacherModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
        { id: user._id, name: user.name, role: 'Teacher' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({ message: 'Login success', token });
});

// Get All Teachers Route
router.get('/all/teachers', verifyHod, async (req, res) => {
    try {
        const teachers = await TeacherModel.find();
        res.json(teachers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in fetching teachers' });
    }
})

// Delete Teacher Route
router.delete('/delete/teacher/:id', verifyHod, async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await TeacherModel.findByIdAndDelete(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in deleting teacher' });
    }
});

// Teacher Salary Update Route
router.put('/update/teacher-salary/:id', verifyHod, async (req, res) => {
    const { id } = req.params;
    const { totalSalary, dueSalary } = req.body;

    try {
        const teacher = await TeacherModel.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        if (totalSalary !== undefined) teacher.totalSalary = totalSalary;
        if (dueSalary !== undefined) teacher.dueSalary = dueSalary;

        await teacher.save();

        res.json({
            message: 'Teacher salary updated successfully',
            user: teacher
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in salary update' });
    }
});

//Student fee update route
router.put('/update/student-fee/:id',verifyTeacher, async (req, res) => {
    const { id } = req.params;
    const { totalCourseFee, depositedFee, dueFee } = req.body;

    try {
        const student = await StudentModel.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (totalCourseFee !== undefined) student.totalCourseFee = totalCourseFee;
        if (depositedFee !== undefined) student.depositedFee = depositedFee;
        if (dueFee !== undefined) student.dueFee = dueFee;

        await student.save();

        res.json({
            message: 'Student fee updated successfully',
            user: student
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in fee part' });
    }
});

// Register a Student Route
router.post('/register/student', verifyTeacher, async (req, res) => {
    const {
        name,
        email,
        password,
        fatherName,
        motherName,
        course,
        age,
        city,
        state,
        totalCourseFee,
        depositedFee,
        dueFee
    } = req.body;

    // Check all fields are present
    if (!name || !email || !password || !fatherName || !motherName || !course ||
        !age || !city || !state || !totalCourseFee || depositedFee == null || dueFee == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if student already exists
        const existingStudent = await StudentModel.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student with teacher as approver
        const newStudent = new StudentModel({
            name,
            email,
            password: hashedPassword,
            fatherName,
            motherName,
            course,
            age,
            city,
            state,
            totalCourseFee,
            depositedFee,
            dueFee,
            role: 'Student',
            approvedBy: req.user.id  // teacher's ID from token
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student registered successfully',
            user: {
                id: newStudent._id,
                name: newStudent.name,
                email: newStudent.email,
                role: newStudent.role,
                approvedBy: newStudent.approvedBy
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in student reg' });
    }
});


// Login Student Route
router.post('/login/student', async (req, res) => {

    const { email, password } = req.body;
    const user = await StudentModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login success', token });

})

router.get('/all/student',verifyTeacher, async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Delete Student Route
router.delete('/delete/student/:id', verifyTeacher, async (req, res) => {
    const { id } = req.params;

    try {
        const student = await StudentModel.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong in deleting student' });
    }
});

// Protected Route
router.get('/Deshboard', verifyToken, (req, res) => {
    res.json({ message: 'Protected data', user: req.user });
});

module.exports = router;
