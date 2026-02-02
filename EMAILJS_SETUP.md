# EmailJS Setup Guide

Follow these steps to set up EmailJS for your contact form:

## Step 1: Create EmailJS Account
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. Click on "Email Services" in the left sidebar
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the instructions to connect your email
5. Copy the **Service ID** (e.g., `service_xyz123`)

## Step 3: Create Email Template
1. Click on "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Set up your template with these variables:
   ```
   From: {{from_name}} <{{from_email}}>
   Subject: Portfolio Contact: {{subject}}
   
   Message:
   {{message}}
   
   ---
   Sent from: {{from_email}}
   ```
4. Copy the **Template ID** (e.g., `template_abc456`)

## Step 4: Get Public Key
1. Click on "Account" in the left sidebar
2. Go to "General" tab
3. Copy your **Public Key** (e.g., `ABCdefGHI123jkl`)

## Step 5: Update Environment Variables
1. Open the `.env.local` file in your portfolio folder
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
   ```

## Step 6: Restart Development Server
```bash
npm run dev
```

## Testing
1. Go to your contact form
2. Fill in all fields
3. Click "Send Message"
4. Check your email (hamzaakram53454@gmail.com) for the message

## Troubleshooting
- If emails aren't sending, check the browser console for errors
- Make sure all environment variables are set correctly
- Verify your EmailJS service is connected and active
- Check your EmailJS dashboard for any error messages

## Free Tier Limits
- 200 emails per month
- No credit card required
- Perfect for a portfolio contact form
