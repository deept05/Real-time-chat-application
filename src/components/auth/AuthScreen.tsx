import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Zap, Shield } from 'lucide-react';

const AuthScreen = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="h-12 w-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mr-3">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Connectify Live
              </h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Real-time messaging for modern teams
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect, collaborate, and communicate with your team in real-time. 
              Experience seamless messaging with multiple rooms and instant updates.
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Instant message delivery and live user presence
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Multiple Rooms</h3>
                <p className="text-sm text-muted-foreground">
                  Organize conversations in dedicated channels
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Secure Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Protected with enterprise-grade security
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Rich Messaging</h3>
                <p className="text-sm text-muted-foreground">
                  Support for emojis, files, and rich text
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex justify-center">
          <SignedOut>
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {showSignUp ? 'Create your account' : 'Welcome back'}
                </CardTitle>
                <CardDescription>
                  {showSignUp 
                    ? 'Join thousands of teams already using Connectify Live' 
                    : 'Sign in to continue to your team workspace'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showSignUp ? (
                  <div className="space-y-4">
                    <SignUp 
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-primary hover:bg-primary/90',
                          card: 'shadow-none border-0 p-0',
                          headerTitle: 'hidden',
                          headerSubtitle: 'hidden',
                          socialButtonsBlockButton: 'border-border hover:bg-muted',
                          formFieldInput: 'border-border focus:ring-primary',
                          footerActionLink: 'text-primary hover:text-primary/90'
                        }
                      }}
                      fallbackRedirectUrl="/"
                    />
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => setShowSignUp(false)}
                        className="text-muted-foreground"
                      >
                        Already have an account? Sign in
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <SignIn 
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-primary hover:bg-primary/90',
                          card: 'shadow-none border-0 p-0',
                          headerTitle: 'hidden',
                          headerSubtitle: 'hidden',
                          socialButtonsBlockButton: 'border-border hover:bg-muted',
                          formFieldInput: 'border-border focus:ring-primary',
                          footerActionLink: 'text-primary hover:text-primary/90'
                        }
                      }}
                      fallbackRedirectUrl="/"
                    />
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        onClick={() => setShowSignUp(true)}
                        className="text-muted-foreground"
                      >
                        Don't have an account? Sign up
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;