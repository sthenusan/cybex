const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sendEmail } = require('./config/email');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        active: 'home'
    });
});

// Services routes
app.get('/services', (req, res) => {
    res.render('services/index', {
        title: 'Our Services',
        active: 'services'
    });
});

app.get('/services/:type', (req, res) => {
    const serviceTypes = {
        commercial: 'Commercial Construction',
        residential: 'Residential Projects',
        industrial: 'Industrial Solutions',
        interior: 'Interior Renovations',
        infrastructure: 'Infrastructure Development'
    };

    const serviceType = req.params.type;
    const serviceTitle = serviceTypes[serviceType];

    if (!serviceTitle) {
        return res.status(404).render('404', {
            title: 'Page Not Found',
            active: 'services'
        });
    }

    res.render(`services/${serviceType}`, {
        title: serviceTitle,
        active: 'services'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        active: 'about'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects', {
        title: 'Our Projects',
        active: 'projects'
    });
});

app.get('/testimonials', (req, res) => {
    res.render('testimonials', {
        title: 'Testimonials',
        active: 'testimonials'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
        active: 'contact'
    });
});

// Handle contact form submission
app.post('/contact', async (req, res) => {
    try {
        // Send email
        const emailResult = await sendEmail(req.body);
        
        if (emailResult.success) {
            res.status(200).json({ 
                success: true, 
                message: 'Thank you for your message. We will contact you soon!' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send email. Please try again later.' 
            });
        }
    } catch (error) {
        console.error('Error in contact form submission:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again later.' 
        });
    }
});

// Handle newsletter subscription
app.post('/subscribe', (req, res) => {
    const { email } = req.body;
    
    // Here you would typically:
    // 1. Validate the email
    // 2. Store it in a database
    // 3. Send a confirmation email
    // For now, we'll just send a success response
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Simulate successful subscription
    res.status(200).json({ message: 'Successfully subscribed to newsletter' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        active: ''
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 