export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p className="footer-text">
                    © {new Date().getFullYear()} PollFlow. All rights reserved.
                </p>
                <div className="footer-links">
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <a href="#" className="footer-link">Terms of Service</a>
                    <a href="#" className="footer-link">Contact</a>
                </div>
            </div>
        </footer>
    )
}
