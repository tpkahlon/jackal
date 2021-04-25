import React, { useContext } from "react";
import { ButtonGroup, Button, Table } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy, FaPlay } from "react-icons/fa";
import { isBrowser, isMobile } from "react-device-detect";
import { ToastContainer, toast } from "react-toastify";
import MenuContext from "../context/MenuContext";
import MyPlaylistContext from "../context/MyPlaylistContext";

const CartList = () => {
  const { channel, setChannel } = useContext(MenuContext);
  const { playlist } = useContext(MyPlaylistContext);
  const notify = () => toast.dark("Channel link copied successfully!");
  const handlePlay = (currentUrl) => {
    if (isBrowser) {
      setChannel({
        ...channel,
        url: currentUrl,
        keyword: "",
      });
    }
    if (isMobile) {
      window.open(currentUrl, "_blank");
    }
  };
  return (
    <>
      <Table variant="dark" striped responsive borderless className="m-0">
        <thead>
          <tr>
            <td style={{ width: "15%" }}>
              <strong>ID</strong>
            </td>
            <td style={{ width: "50%" }}>
              <strong>Channel</strong>
            </td>
            <td>
              <strong>Controls</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {JSON.parse(playlist).map((j, id) => {
            const { title, url, ban } = j;
            const isHTTP = url && url.includes("http://") ? true : false;
            return (
              <tr key={id} className={ban ? "bg-danger bg-danger--css" : ""}>
                <td
                  className="text-wrap h-100"
                  style={{ background: isHTTP ? "orange" : "green" }}
                >
                  {++id}
                </td>
                <td className="text-wrap h-100">{title}</td>
                <td className="text-wrap">
                  <div className="d-flex align-items-center">
                    <ButtonGroup>
                      <Button variant="success" onClick={() => handlePlay(url)}>
                        <FaPlay />
                      </Button>
                      <CopyToClipboard text={url} onCopy={notify}>
                        <Button variant="info">
                          <FaRegCopy />
                        </Button>
                      </CopyToClipboard>
                    </ButtonGroup>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <ToastContainer />
    </>
  );
};

export default CartList;