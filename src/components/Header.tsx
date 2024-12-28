import React from 'react';

const constructionPatternStyle = {
    background: 'repeating-linear-gradient(45deg, #000000, #000000 10px, #ffee00 10px, #ffee00 20px)',
    width: '100%',
    height: '10px',
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#171717',
    color: '#ffffff',
    padding: '20px 0px',
    textAlign: 'center',
    fontFamily: 'Barlow, sans-serif',
    width: '100%',
};

const headingStyle: React.CSSProperties = {
    fontFamily: 'Oswald, sans-serif',
    fontSize: '4rem',
    fontWeight: 600,
    margin: '10px 0',
    color: 'white',
};

const linkStyle: React.CSSProperties = {
    color: '#00aaff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    padding: '0',
};

const fontStyle: React.CSSProperties = {
    fontSize: '1.5em',
    margin: '5px',
}

export const Header = () => {
    return (
        <header>
            <div style={headerStyle}>
                <h1 style={headingStyle}>Custom Console Demo</h1>
                <p style={fontStyle}>
                    Check out more of my projects{' '}
                    <a
                        href="https://moaesaycto.github.io"
                        style={linkStyle}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                        here
                    </a>
                    !
                </p>
            </div>
            <div style={constructionPatternStyle} />
        </header>
    );
};

export default Header;
