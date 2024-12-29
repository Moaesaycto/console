const constructionPatternStyle = {
    background: 'repeating-linear-gradient(45deg, #000000, #000000 10px, #ffee00 10px, #ffee00 20px)',
    width: '100%',
    height: '10px',
};

const footerContainerStyle = {
    backgroundColor: '#171717',
    color: '#ffffff',
    textAlign: 'center' as const,
    padding: '20px 10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
};

const linkStyle = {
    color: '#00aaff',
    textDecoration: 'none',
};

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div style={constructionPatternStyle} />

            <div style={footerContainerStyle}>
                <p style={{ fontSize: "20px" }}>
                    Like what I do? Consider checking me out{' '}
                    <a
                        href="https://moaesaycto.github.io"
                        style={linkStyle}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                        here
                    </a>
                    .
                </p>
                <p>&copy; {currentYear} MOAE. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
