import React, { useEffect, useRef } from 'react';

function CanvasWithQuicksand() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set kích thước canvas (nên set thuộc tính width/height, không chỉ style)
    canvas.width = 1020;
    canvas.height = 325;

    // Xóa canvas trước khi vẽ
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font với Quicksand
    ctx.font = '30px Quicksand';
    ctx.fillStyle = 'black';

    // Vẽ chữ lên canvas
    ctx.fillText('Đây là font Quicksand trên canvas', 50, 100);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{
        boxSizing: 'border-box',
        display: 'block',
        height: '260px',
        width: '816px',
        border: '1px solid #ccc', // thêm border để dễ thấy canvas
      }}
    />
  );
}

export default CanvasWithQuicksand;