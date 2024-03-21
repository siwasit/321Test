import { shareFile } from "./sharefile";

// const { shareFile } = require('./sharefile');

describe('shareFile', () => {
  let socket;
  let consoleLog;

  beforeEach(() => {
    consoleLog = jest.spyOn(console, 'log');
    socket = new WebSocket('ws://localhost:7460');
    socket.send = jest.fn();
  });

  afterEach(() => {
    consoleLog.mockRestore();
  });

  const receiverID = '1';
  const metadata = {
    total_buffer_size: 1000,
    buffer_size: 100
  };
  const buffer = new ArrayBuffer(1000);
  const progress_node = {
    innerText: '0%'
  };

  it('should send metadata and file chunks', () => {
    const chunkSize = 100;
    const numChunks = metadata.total_buffer_size / chunkSize;

    shareFile(metadata, buffer, progress_node);

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'file-meta',
        uid: receiverID,
        metadata: metadata
      })
    );

    for (let i = 0; i < numChunks; i++) {
      const chunkStart = i * chunkSize;
      const chunkEnd = (i + 1) * chunkSize;
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'file-raw',
          uid: receiverID,
          buffer: Array.from(new Uint8Array(buffer.slice(chunkStart, chunkEnd)))
        })
      );
    }

    expect(socket.send).toHaveBeenCalledTimes(numChunks + 1);
    expect(consoleLog).toHaveBeenCalledWith('chunk: ', expect.any(ArrayBuffer), expect.any(Array));
  });
});