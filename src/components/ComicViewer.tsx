
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from 'lucide-react';
import { ComicData, ComicService } from '@/services/comicService';
import { toast } from "@/hooks/use-toast";

interface ComicViewerProps {
  comicData: ComicData;
  onDownload?: () => void;
}

const ComicViewer: React.FC<ComicViewerProps> = ({ comicData, onDownload }) => {
  const handleDownloadPDF = async () => {
    try {
      console.log('Generating PDF for comic:', comicData.title);
      const pdfBlob = await ComicService.generatePDF(comicData);
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${comicData.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "🎉 Comic Downloaded!",
        description: "Your magical comic is ready to print and share!",
      });
      
      onDownload?.();
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "😅 Oops!",
        description: "Bunny had trouble making your PDF. Try again!",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: comicData.title,
          text: `Check out my amazing comic: ${comicData.title}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "📋 Link Copied!",
        description: "Share this link with your friends!",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">{comicData.title}</h2>
        <p className="text-lg text-gray-600">Your magical {comicData.theme} adventure!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {comicData.panels.map((panel) => (
          <Card key={panel.panel} className="bg-white shadow-xl border-4 border-purple-200 hover:border-purple-300 transition-all">
            <CardContent className="p-4">
              <div className="text-center mb-3">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Panel {panel.panel}
                </span>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center border-2 border-dashed border-orange-300">
                <img 
                  src={panel.imageUrl} 
                  alt={`Panel ${panel.panel}`}
                  className="max-w-full max-h-full object-contain rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center">
                        <div class="text-4xl mb-2">🎨</div>
                        <p class="text-gray-600">Panel ${panel.panel}</p>
                      </div>
                    `;
                  }}
                />
              </div>
              <p className="text-sm text-gray-700 text-center bg-white/80 rounded p-2">
                {panel.caption}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleDownloadPDF}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl"
        >
          <Download className="mr-2" size={20} />
          📥 Download Comic
        </Button>
        <Button
          onClick={handleShare}
          size="lg"
          variant="outline"
          className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-full text-lg shadow-xl"
        >
          <Share2 className="mr-2" size={20} />
          📤 Share Comic
        </Button>
      </div>
    </div>
  );
};

export default ComicViewer;
