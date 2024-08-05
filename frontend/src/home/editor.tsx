import React, { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";
import { Poll } from "../interfaces/interfaces";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const Editor = () => {
  const client = axiosClient();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);

  useEffect(() => {
    client.get('/poll').then((response) => {
      setPolls(response.data);
    }).catch((error) => {
      console.error("Error fetching polls:", error);
    });
  }, []);

  const selectPoll = (poll: Poll) => {
    setSelectedPollId(poll.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number, field: keyof Poll) => {
    const newValue = e.target.value;
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === id ? { ...poll, [field]: newValue } : poll
      )
    );
  };

  const handleSubmit = () => {
    const selectedPoll = polls.find(poll => poll.id === selectedPollId);
    if (selectedPoll) {
      client.patch(`/poll/${selectedPoll.id}`, selectedPoll).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.error("Error updating poll:", error);
      });
    }
  };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {polls.map((poll) => (
                <TableRow
                  key={poll.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => selectPoll(poll)}
                >
                  {selectedPollId !== poll.id ? (
                    <>
                      <TableCell component="th" scope="row">{poll.title}</TableCell>
                      <TableCell>{poll.description}</TableCell>
                      <TableCell>{poll.link}</TableCell>
                      <TableCell>{poll.status}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell component="th" scope="row">
                        <input
                          type="text"
                          value={poll.title}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'title')}
                          autoFocus
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={poll.description}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'description')}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={poll.link}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'link')}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={poll.status}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'status')}
                        />
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button type="submit" variant="contained" color="primary">Save</Button>
      </form>
    </div>
  );
};

export default Editor;
