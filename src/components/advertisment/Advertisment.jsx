import classes from "./Advertisment.module.css";

const Advertisement = () => {
    return (
        <div className={classes.item} style={{ height: "100%" }}>
            {/* <iframe 
            src="https://player.vimeo.com/video/659963617?h=d0cd07c6bd" 
            height="150" 
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            style="float: left;"
            allowfullscreen=""
            >
            </iframe> */}
            {/* <h2 style={{ color: "white", textAlign: "center" }}></h2> */}
            {/* <video>
                <source src="" type="video/mp4" />
            </video> */}
            /*<div>
            <iframe
                width="100%"
                height="150"
                src="https://player.vimeo.com/video/659963617?h=d0cd07c6bd"
                title="Mulder Christmas Improvisation"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
            ></iframe>
            <span>Mulder plays an Organ Improvisation on Dutch and British Christmas Carols, 
                during a sold-out concert at the St. Laurenskerk Cathedral in Rotterdam (the Netherlands).
                <br></br><br></br>
                    <p>Mulder&apos;s Christmas Greeting: May God bless you in the year to come with peace, hope, and joy in Christ, our Savior.</p>
                </span>
            </div>
            */
        </div>
    );
};

export default Advertisement;
