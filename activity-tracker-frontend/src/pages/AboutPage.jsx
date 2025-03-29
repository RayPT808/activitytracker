import React from 'react';

const AboutPage = () => {
    return (
        <div className="about-page">
            <header className="about-header">
                <h1>About Us</h1>
            </header>
            <main className="about-content">
                <section className="about-introduction">
                    <h2>Welcome to Our Activity Tracker</h2>
                    <p>
                        Our mission is to help you stay organized and productive by tracking your daily activities effectively.
                    </p>
                </section>
                <section className="about-details">
                    <h3>What We Offer</h3>
                    <ul>
                        <li>Easy-to-use activity tracking tools</li>
                        <li>Insights into your productivity</li>
                        <li>Customizable features to suit your needs</li>
                    </ul>
                </section>
                <section className="about-team">
                    <h3>Meet the Team</h3>
                    <p>
                        We are a group of passionate developers and designers dedicated to creating tools that make your life easier.
                    </p>
                </section>
            </main>
            <footer className="about-footer">
                <p>&copy; {new Date().getFullYear()} Activity Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutPage;