// pages/contact.tsx
"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import styles from '../styles/Contact.module.css';
import Nav from '../components/nav';
import CountryNav from '../components/countryNav';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletterEmail: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletterEmail: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    message: '',
    isError: false,
    isSubmitted: false,
  });
  
  const [newsletterStatus, setNewsletterStatus] = useState({
    message: '',
    isError: false,
    isSubmitted: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        message: 'Please fill in all required fields',
        isError: true,
        isSubmitted: false,
      });
      return;
    }
    
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     subject: formData.subject,
      //     message: formData.message,
      //   }),
      // });
      
      // if (!response.ok) throw new Error('Failed to submit');
      
      // Simulating successful submission
      setFormStatus({
        message: 'Message sent successfully! I\'ll get back to you soon.',
        isError: false,
        isSubmitted: true,
      });
      
      // Clear form
      setFormData(prev => ({
        ...prev,
        name: '',
        email: '',
        subject: '',
        message: '',
      }));
    } catch (error) {
      setFormStatus({
        message: 'Failed to send message. Please try again later.',
        isError: true,
        isSubmitted: false,
      });
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.newsletterEmail) {
      setNewsletterStatus({
        message: 'Please enter your email',
        isError: true,
        isSubmitted: false,
      });
      return;
    }
    
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.newsletterEmail }),
      // });
      
      // if (!response.ok) throw new Error('Failed to subscribe');
      
      // Simulating successful submission
      setNewsletterStatus({
        message: 'Successfully subscribed to the newsletter!',
        isError: false,
        isSubmitted: true,
      });
      
      // Clear newsletter email
      setFormData(prev => ({ ...prev, newsletterEmail: '' }));
    } catch (error) {
      setNewsletterStatus({
        message: 'Failed to subscribe. Please try again later.',
        isError: true,
        isSubmitted: false,
      });
    }
  };

  return (
    <>
    <Nav onGlobeClick={() => {}} />
    <CountryNav />
    <div className="p-8 pt-40">
      <Head>
        <title>Contact Me | My Travel Blog</title>
        <meta name="description" content="Get in touch with me about my travel adventures" />
      </Head>
      
      <div className={styles.container}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>Have questions or want to collaborate? I'd love to hear from you!</p>
        
        <div className={styles.contentWrapper}>
          <div className={styles.contactInfo}>
            <h2>Connect With Me</h2>
            
            <div className={styles.contactItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>hello@mytravelblog.com</span>
            </div>
            
            <div className={styles.contactItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <a href="https://instagram.com/mytravelblog" target="_blank" rel="noopener noreferrer">@mytravelblog</a>
            </div>
            
            <div className={styles.contactItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
              <a href="https://twitter.com/mytravelblog" target="_blank" rel="noopener noreferrer">@mytravelblog</a>
            </div>
            
            <div className={styles.contactItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <a href="https://facebook.com/mytravelblog" target="_blank" rel="noopener noreferrer">My Travel Blog</a>
            </div>
            
            <div className={styles.contactItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <a href="https://linkedin.com/in/mytravelblog" target="_blank" rel="noopener noreferrer">My Travel Blog</a>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <h2>Send Me a Message</h2>
            
            <form onSubmit={handleContactSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              {formStatus.message && (
                <div className={`${styles.formStatus} ${formStatus.isError ? styles.error : styles.success}`}>
                  {formStatus.message}
                </div>
              )}
              
              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        </div>
        
        <div className={styles.newsletter}>
          <h2>Subscribe to My Newsletter</h2>
          <p>Get the latest travel stories, tips, and photos delivered straight to your inbox!</p>
          
          <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
            <input
              type="email"
              name="newsletterEmail"
              placeholder="Your email address"
              value={formData.newsletterEmail}
              onChange={handleChange}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          
          {newsletterStatus.message && (
            <div className={`${styles.formStatus} ${newsletterStatus.isError ? styles.error : styles.success}`}>
              {newsletterStatus.message}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}