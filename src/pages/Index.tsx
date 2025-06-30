
import React, { useState } from 'react';
import { Upload, Sparkles, BookOpen, Star, Heart, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [step, setStep] = useState(1);
  const [storyPrompt, setStoryPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = [
    { id: 'adventure', name: '🏴‍☠️ Adventure', color: 'bg-orange-100 border-orange-300' },
    { id: 'space', name: '🚀 Space', color: 'bg-blue-100 border-blue-300' },
    { id: 'forest', name: '🌳 Forest', color: 'bg-green-100 border-green-300' },
    { id: 'magic', name: '✨ Magic', color: 'bg-purple-100 border-purple-300' },
    { id: 'ocean', name: '🌊 Ocean', color: 'bg-cyan-100 border-cyan-300' },
    { id: 'castle', name: '🏰 Castle', color: 'bg-pink-100 border-pink-300' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "📸 Photo uploaded!",
        description: "Your character is ready for the adventure!",
      });
    }
  };

  const handleCreateComic = async () => {
    if (!storyPrompt || !selectedTheme) {
      toast({
        title: "🐰 Bunny needs more info!",
        description: "Please add your story idea and pick a theme!",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    console.log("Creating comic with:", { storyPrompt, selectedTheme, hasImage: !!uploadedImage });
    
    // Simulate API call for demo
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "🎉 Your comic is ready!",
        description: "Bunny has created something magical for you!",
      });
      setStep(4);
    }, 3000);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mb-6 relative">
              <div className="text-8xl mb-4 animate-bounce">🐰</div>
              <div className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</div>
              <div className="absolute -bottom-2 -left-2 text-3xl animate-pulse delay-300">⭐</div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Hi! I'm Bunny!
            </h1>
            <p className="text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let's turn your amazing ideas into a magical comic book adventure! 🌟
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-lg">
                <Camera className="text-purple-500" size={20} />
                <span className="text-gray-700 font-medium">Upload your photo</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-lg">
                <Sparkles className="text-yellow-500" size={20} />
                <span className="text-gray-700 font-medium">Tell me your idea</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-lg">
                <BookOpen className="text-green-500" size={20} />
                <span className="text-gray-700 font-medium">Get your comic</span>
              </div>
            </div>
            <Button 
              onClick={() => setStep(2)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Let's Make a Comic! 🎨
            </Button>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover-scale">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Photo</h3>
                <p className="text-gray-600">You become the hero of your own story!</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover-scale">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Idea</h3>
                <p className="text-gray-600">One sentence becomes a whole adventure!</p>
              </CardContent>
            </Card>
            <Card className="bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover-scale">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Comic</h3>
                <p className="text-gray-600">A beautiful comic book just for you!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🐰✨</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Upload Your Photo</h2>
              <p className="text-xl text-gray-600">This will be YOU in the comic!</p>
            </div>

            <Card className="bg-white/80 shadow-2xl border-0 mb-6">
              <CardContent className="p-8">
                <div className="border-4 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded character" 
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-300"
                      />
                      <p className="text-green-600 font-bold text-lg">Perfect! You look amazing! 🌟</p>
                      <Button
                        onClick={() => setUploadedImage(null)}
                        variant="outline"
                        className="mt-2"
                      >
                        Choose Different Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto text-purple-400" size={48} />
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Click to upload your photo
                        </p>
                        <p className="text-gray-500">
                          Pick your favorite selfie! 📸
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition-colors"
                      >
                        Choose Photo 📷
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                ← Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={!uploadedImage}
              >
                Next: Story Time! →
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🐰💭</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Tell Me Your Story Idea</h2>
              <p className="text-xl text-gray-600">What amazing adventure should we create?</p>
            </div>

            <Card className="bg-white/80 shadow-2xl border-0 mb-8">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                      🌟 Your Amazing Idea:
                    </label>
                    <Textarea
                      placeholder="I found a magical bunny that could fly..."
                      value={storyPrompt}
                      onChange={(e) => setStoryPrompt(e.target.value)}
                      className="w-full p-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-0 min-h-[120px] bg-white/80"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Just one sentence is enough! Bunny will make it into a whole story! ✨
                    </p>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-4">
                      🎨 Pick Your Theme:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            selectedTheme === theme.id
                              ? theme.color + ' border-4 shadow-lg'
                              : 'bg-white/50 border-gray-200 hover:bg-white/70'
                          }`}
                        >
                          <span className="font-bold text-lg">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                ← Back
              </Button>
              <Button
                onClick={handleCreateComic}
                size="lg"
                className="flex-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                disabled={!storyPrompt || !selectedTheme || isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Creating Magic...
                  </div>
                ) : (
                  "Create My Comic! 🎨✨"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Your Comic is Ready!
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Bunny has created something absolutely magical just for you! 
              </p>
            </div>

            {/* Comic Preview Placeholder */}
            <Card className="bg-white/80 shadow-2xl border-0 mb-8">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-8 min-h-[400px] flex items-center justify-center border-4 border-dashed border-orange-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📚✨</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Your Amazing Comic</h3>
                    <p className="text-gray-600 mb-4">
                      "{storyPrompt}" becomes a wonderful {themes.find(t => t.id === selectedTheme)?.name} adventure!
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
                      {[1, 2, 3, 4, 5, 6].map((panel) => (
                        <div key={panel} className="bg-white rounded-lg p-4 shadow-md border-2 border-purple-200">
                          <div className="text-2xl mb-2">🎨</div>
                          <div className="text-xs text-gray-500">Panel {panel}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg"
              >
                📥 Download Comic
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-full text-lg"
                onClick={() => {
                  setStep(1);
                  setStoryPrompt('');
                  setSelectedTheme('');
                  setUploadedImage(null);
                }}
              >
                🎨 Make Another Comic
              </Button>
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600">
                <Heart className="text-red-500" size={20} />
                <span className="text-lg">Made with love by Bunny</span>
                <Heart className="text-red-500" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
