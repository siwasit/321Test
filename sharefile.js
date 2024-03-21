export function shareFile(metadata, buffer, progress_node) {
    socket.send(JSON.stringify({ type: "file-meta", uid: receiverID, metadata: metadata }));

    function sendChunk() {
        if (buffer.length === 0) {
            return;
        }

        let chunk = buffer.slice(0, metadata.buffer_size);
        buffer = buffer.slice(metadata.buffer_size);

        console.log('chunk: ', chunk, buffer);

        progress_node.innerText = Math.trunc((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100) + "%";
              
        // socket.send(JSON.stringify({ type: "file-raw", uid: receiverID, buffer: chunk }));
        socket.send(JSON.stringify({ type: "file-raw", uid: receiverID, buffer: Array.from(chunk) }));
        
        setTimeout(sendChunk, 0);
    }
    sendChunk();
}