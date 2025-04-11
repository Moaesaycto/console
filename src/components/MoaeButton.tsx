const MoaeButton = () => {
    return (
        <a
            href="https://moaesaycto.github.io/"
            className="moae-button"
            style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: "#6F7072",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "5px",
                fontWeight: "bold"
            }}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img
                src={`moae-logo.svg`}
                alt="MOAE Logo"
                style={{ marginRight: "5px", height: "20px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>MOAE</span>
        </a>
    )
}

export default MoaeButton;