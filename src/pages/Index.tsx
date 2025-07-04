import React, { useState } from 'react';
import { Upload, Sparkles, BookOpen, Star, Heart, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ComicService, ComicData } from '@/services/comicService';
import ComicViewer from '@/components/ComicViewer';

const Index = () => {
  const [step, setStep] = useState(1);
  const [storyPrompt, setStoryPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComic, setGeneratedComic] = useState<ComicData | null>(null);

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
        title: "📸 Amazing photo!",
        description: "I can see you! You're going to be the star of this comic!",
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
    console.log("Creating personalized comic with:", { storyPrompt, selectedTheme, hasImage: !!uploadedImage });
    
    try {
      toast({
        title: "🎨 Creating your comic!",
        description: "Bunny is analyzing your photo and writing your story...",
      });
      
      const comic = await ComicService.generateComic(storyPrompt, selectedTheme, uploadedImage || undefined);
      setGeneratedComic(comic);
      setStep(4);
      
      toast({
        title: "🎉 Your personalized comic is ready!",
        description: "Look! You're the hero of this amazing adventure!",
      });
    } catch (error) {
      console.error('Comic generation failed:', error);
      toast({
        title: "😅 Oops!",
        description: "Bunny had trouble making your comic. Let's try again!",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
              Let's turn your amazing ideas into a magical comic book adventure where YOU are the hero! 🌟
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
                <span className="text-gray-700 font-medium">Become the hero</span>
              </div>
            </div>
            <Button 
              onClick={() => setStep(2)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Let's Make YOU the Hero! 🎨
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
                <p className="text-gray-600">A personalized comic book starring YOU!</p>
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
              <p className="text-xl text-gray-600">This will be YOU in the comic adventure!</p>
            </div>

            <Card className="bg-white/80 shadow-2xl border-0 mb-6">
              <CardContent className="p-8">
                <div className="border-4 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Your photo - the hero of the story!" 
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-purple-300"
                      />
                      <p className="text-green-600 font-bold text-lg">Perfect! You look like a real hero! 🌟</p>
                      <p className="text-sm text-gray-600">I'll make sure you're the main character in your comic!</p>
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
                          Pick your favorite photo so I can make you the hero! 📸
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
              <p className="text-xl text-gray-600">What amazing adventure should we create for you?</p>
            </div>

            <Card className="bg-white/80 shadow-2xl border-0 mb-8">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">
                      🌟 Your Amazing Idea:
                    </label>
                    <Textarea
                      placeholder="I want to explore space and meet aliens..."
                      value={storyPrompt}
                      onChange={(e) => setStoryPrompt(e.target.value)}
                      className="w-full p-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-0 min-h-[120px] bg-white/80"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Just one sentence is enough! I'll turn YOU into the hero of this story! ✨
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
                    Creating Your Story...
                  </div>
                ) : (
                  "Make Me The Hero! 🎨✨"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4 && generatedComic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Your Personal Comic is Ready!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Look! You're the hero of this amazing adventure! 
            </p>
          </div>

          <ComicViewer 
            comicData={generatedComic}
            onDownload={() => {
              toast({
                title: "🎉 Amazing!",
                description: "Your personalized comic is ready to share with everyone!",
              });
            }}
          />

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-full text-lg"
              onClick={() => {
                setStep(1);
                setStoryPrompt('');
                setSelectedTheme('');
                setUploadedImage(null);
                setGeneratedComic(null);
              }}
            >
              🎨 Make Another Hero Story
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
    );
  }

  return null;
};

export default Index;
