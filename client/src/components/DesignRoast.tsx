// src/components/DesignRoast.tsx
import { useState } from 'react';
import UploadArea from './UploadArea';
import { useAppContext } from '@/context/AppContext';
import { v4 as uuid } from 'uuid';

export default function DesignRoast() {
  const [isRoasting, setIsRoasting] = useState(false);
  const {
    uploadedImage, setUploadedImage,
    designRoast, setDesignRoast,
    roastHistory, addToRoastHistory,
  } = useAppContext();

  // Simulated AI roast; replace with real API call
  const roastImage = async (file: File, preview: string) => {
    setIsRoasting(true);
    setDesignRoast(null);

    await new Promise((r) => setTimeout(r, 1500));

    const newRoast = {
      id: uuid(),
      title: "Solid layout, but color clash",
      score: 5,
      feedback: [
        { type: 'negative', text: 'Overuse of bright gradients' },
        { type: 'warning',  text: 'Inconsistent font sizes' },
        { type: 'positive', text: 'Clean whitespace and alignment' },
      ],
      suggestedFix: 'Limit to 2–3 colors; unify font scale; add 20px padding.',
      imagePreview: preview,
    };

    setDesignRoast(newRoast);
    addToRoastHistory(newRoast);
    setIsRoasting(false);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;
      setUploadedImage({ file, preview });
      roastImage(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const clearAll = () => {
    setUploadedImage(null);
    setDesignRoast(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Design Roast</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload / Preview */}
        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg">
          {!uploadedImage ? (
            <UploadArea onUpload={handleUpload} />
          ) : (
            <div className="relative">
              <img src={uploadedImage.preview} className="w-full rounded-lg" />
              <button
                onClick={clearAll}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Roast / History */}
        <div className="bg-neutral-800 rounded-xl shadow-lg p-6 min-h-[300px]">
          {isRoasting ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin mb-4">⏳</div>
              <p>Roasting your design…</p>
            </div>
          ) : designRoast ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">🔥 {designRoast.title}</h3>
                <span className="font-bold">{designRoast.score}/10</span>
              </div>

              <ul className="mt-4 space-y-2">
                {designRoast.feedback.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span
                      className={
                        f.type === 'negative'
                          ? 'text-red-500'
                          : f.type === 'warning'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }
                    >
                      •
                    </span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                <h4 className="font-medium">Suggested Fix</h4>
                <p className="mt-2 text-sm">{designRoast.suggestedFix}</p>
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={clearAll} className="px-4 py-2 bg-red-600 rounded">
                  Clear
                </button>
                <button onClick={() => alert('Saved!')} className="px-4 py-2 bg-green-600 rounded">
                  Save Feedback
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400 mt-16">Upload a design to begin.</p>
          )}

          {/* Roast History */}
          {roastHistory.length > 0 && (
            <details className="mt-6 text-sm text-gray-300">
              <summary className="cursor-pointer">▶ Past Roasts ({roastHistory.length})</summary>
              <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {roastHistory.map((r) => (
                  <li key={r.id} className="flex items-center space-x-2">
                    <img src={r.imagePreview} className="w-8 h-8 rounded" />
                    <button
                      onClick={() => {
                        setDesignRoast(r);
                        setUploadedImage({ file: r as any, preview: r.imagePreview });
                      }}
                      className="underline"
                    >
                      {r.title} — {r.score}/10
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
