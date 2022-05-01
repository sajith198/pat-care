import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Tabs,
  Tab,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Popover,
} from "react-bootstrap";
import "./style.css";
import Datetime from "react-datetime";
import RoomWiseTable from "../../Tables/RoomWiseTable";

import useFetch from "../../../configs/useFetch";
import { CHECKOUT, GET_ASSIGNED_ROOMS } from "../../../configs/apiRoutes";
import RetryButton from "../../../App/components/RetryButton";
import CustomMenu from "../../../App/components/CustomMenu";
import AnimatedModal from "../../../App/components/AnimatedModal";
import Emoji from "../../../App/components/Emoji";
import { useAxios } from "../../../configs/useAxios";
import CompletedConcerns from "./Concerns/Completed";

export const Rooms = () => {
  // State Variables
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({});
  const [vote, setVote] = useState(0);
  const [info, setInfo] = useState(true);
  const [selected, setSelected] = useState(5);

  const {
    response: postData,
    error: postError,
    loading: postLoading,
    apiRqst,
  } = useAxios();

  // API For Loading The Room Data
  const { data, loading, error, getData } = useFetch(GET_ASSIGNED_ROOMS);

  const openModal = (room) => {
    setCurrentRoom(room);
    setModal(true);
  };

  const openCheckoutModal = () => {
    setOpen(true);
  };

  // Function For Updating The Vote and Checkout
  const Checkout = () => {
    setInfo(true);
    const body = { id: 0, InOrOut: 2, Vote: vote };
    apiRqst({
      method: "PUT",
      url: CHECKOUT,
      data: body,
    })
      .then(() => {
        setTimeout(() => {
          setOpen(false);
          setInfo(false);
        }, 1000);
        alert("Successfully checked out");
      })
      .catch(() => {
        setOpen(false);
        setInfo(false);
        alert("Successfully checked out");
      });
  };
  const renderRooms = () => {
    if (error) {
      return <RetryButton retryFn={getData} />;
    }
    if (data?.length > 0) {
      const floors = [...new Set(data.map((item) => item.Floor))];
      return floors.map((floor, i) => {
        return (
          <Row key={i}>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">Floor {i + 1}</Card.Title>
                </Card.Header>

                <Card.Body>
                  <Row>
                    {data.map((room, i) => {
                      let patientDetails = ["", "", "", ""];
                      let roomData = room.PatientDetails != null;
                      if (room.PatientDetails != null)
                        patientDetails = room.PatientDetails.split("~");

                      if (room.Floor === floor) {
                        return (
                          // <Col key={i} md={6} xl={2} xs={6} sm={1}>
                          <>
                            {roomData ? (
                              <CustomMenu
                                roomData={room}
                                patientData={patientDetails}
                                isRoomAvail={roomData}
                                onCheckout={openCheckoutModal}
                                onClickConcern={() => openModal(room)}
                              />
                            ) : (
                              <CustomMenu
                                roomData={room}
                                isRoomAvail={roomData}
                                onCheckout={openCheckoutModal}
                                onClickConcern={() => openModal(room)}
                              />
                            )}
                          </>
                          // </Col>
                        );
                      }
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      });
    } else
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="info" />;
        </div>
      );
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>{renderRooms()}</Col>
      </Row>
      <AnimatedModal
        animation={"bounceIn"}
        showModal={open}
        modalClosed={() => setOpen(false)}
      >
        <Card>
          <Card.Header as="h5" className="theme-bg2">
            Give Your Feedback
          </Card.Header>
          <Card.Body>
            <Row>
              <Col
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Emoji
                  symbol="😄"
                  label="5"
                  value={5}
                  vote={setVote}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Emoji
                  symbol="🙂"
                  label="4"
                  value={4}
                  vote={setVote}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Emoji
                  symbol="😐"
                  label="3"
                  value={3}
                  vote={setVote}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Emoji
                  symbol="🙁"
                  label="2"
                  value={2}
                  vote={setVote}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Emoji
                  symbol="😡"
                  label="1"
                  value={1}
                  vote={setVote}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="text-center">
            <button
              onClick={() => Checkout()}
              className="btn btn-theme2 md-close"
            >
              Submit and Checkout
            </button>
          </Card.Footer>
        </Card>
      </AnimatedModal>
      <Modal
        show={modal}
        onHide={() => setModal(false)}
        size="lg"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h6">Room No : {currentRoom.Name}</Modal.Title>
          <Datetime
            dateFormat="dddd D MMMM Y -"
            inputProps={{ placeholder: "Select Date & Time" }}
          />
          {/* {JSON.stringify(currentRoom)} */}
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="pending">
            <Tab eventKey="pending" title="Pending">
              <Row>
                <Col>
                  <CompletedConcerns isRoom roomId={currentRoom.RoomId} />
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
        {/* <Modal.Footer> */}
        {/* <Button variant="secondary" onClick={() => setModal(false)}>
            Close
          </Button> */}
        {/* <Button variant="primary">Save Changes</Button> */}
        {/* /   </Modal.Footer> */}
      </Modal>
    </Container>
  );
};

export default Rooms;