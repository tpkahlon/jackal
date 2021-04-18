import React from "react";
import ReactPlayer from "react-player";
import { FaListUl, FaPlayCircle } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";
import { Button, ListGroup } from "react-bootstrap";
import Version from "./Version";

const Player = ({ url }) => {
  const handleClearStorage = (e) => {
    e.preventDefault();
    localStorage.removeItem("listing");
    window.location.reload();
  };
  return (
    <>
      {url === null ? (
        <div className="banner min-vh-100 d-flex flex-column justify-content-center align-items-center text-white pt-5">
          <div className="banner__text mx-3 py-3 text-center">
            <Version />
            <h1 className="m-0 mb-2">
              <strong>Jackal</strong>
            </h1>
            <h3 className="mb-3">
              <em>
                Watch live TV channels from across the globe with your friends
                and family...
              </em>
            </h3>
            <ListGroup variant="flush" className="mb-3">
              <ListGroup.Item className="text-left" variant="dark">
                See available channels by pressing{" "}
                <span className="mx-1">
                  <FaListUl />
                </span>{" "}
                button
              </ListGroup.Item>
              <ListGroup.Item className="text-left" variant="dark">
                Open a live stream by pasting a M3U8 link in the box and hit the{" "}
                <span className="mx-1">
                  <FaPlayCircle />
                </span>{" "}
                button
              </ListGroup.Item>
              <ListGroup.Item className="text-left" variant="dark">
                View live stream in theatre mode by pressing{" "}
                <span className="mx-1">
                  <BsArrowsFullscreen />
                </span>{" "}
                button
              </ListGroup.Item>
              <ListGroup.Item className="text-left" variant="dark">
                <em>
                  If you are using a phone where M3U8 is not supported, stream
                  will open in a new tab.
                </em>
              </ListGroup.Item>
              <ListGroup.Item className="text-left" variant="dark">
                <em>
                  This application endorses general content only. The database
                  comes from{" "}
                  <a
                    href="https://github.com/iptv-org/iptv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-danger"
                  >
                    <strong>IPTV</strong>
                  </a>
                  's repository. If you notice any unwanted stream, please
                  report the stream
                  <a
                    href="https://github.com/tpkahlon/jackal/pulls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-danger"
                  >
                    <strong>&nbsp;here</strong>
                  </a>
                  . Such stream will be taken down immediately. If you notice
                  any bugs, you can report them using the same provided link.
                </em>
              </ListGroup.Item>
              <ListGroup.Item className="text-left" variant="dark">
                <em className="d-block">
                  We use localStorage API to store data received from IPTV, in
                  your browser. If you want to get a fresh stream of data from
                  IPTV, please click "Refresh" button below.
                </em>
                <Button
                  className="mt-2 mb-2"
                  variant="secondary"
                  onClick={handleClearStorage}
                >
                  Refresh
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      ) : (
        <ReactPlayer className="app" playing controls url={url} />
      )}
    </>
  );
};

export default Player;
