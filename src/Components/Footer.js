// import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div
      style={{
        bottom: 0,
        position: "fixed",
        width: "100vw",
        paddingBottom: "10px",
        zIndex: "999",
        display: "flex",
      }}
    >
      <h5 className="new-footer-text">Copyright © 2023, sdmusicgroup</h5>
      {/* <Link to="/return-policy">
        <h5 style={{ float: "right", paddingRight: "30px", color: "black" }}>
          Return Policy
        </h5>
      </Link> */}
    </div>
  )
}

export default Footer
