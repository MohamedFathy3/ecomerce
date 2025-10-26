import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const PlansLoading = () => {
  return (
    <div className="wrapper min-h-screen py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-muted rounded animate-pulse mx-auto mb-4" />
          <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
        </div>

        {/* Plans Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-8 w-32 bg-muted rounded mx-auto mb-2" />
                <div className="h-4 w-48 bg-muted rounded mx-auto" />
                <div className="mt-6">
                  <div className="h-12 w-40 bg-muted rounded mx-auto mb-2" />
                  <div className="h-4 w-32 bg-muted rounded mx-auto" />
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 bg-muted rounded flex-shrink-0" />
                      <div className="h-4 flex-1 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6">
                <div className="w-full h-11 bg-muted rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <div className="h-6 w-64 bg-muted rounded mx-auto mb-3" />
          <div className="h-4 w-96 bg-muted rounded mx-auto mb-4" />
          <div className="h-10 w-32 bg-muted rounded mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default PlansLoading;
