"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getResponseHistory, deleteResponseFromHistory } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { Trash2, ArrowLeft, ExternalLink, Clock, Building } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type HistoryItem = {
  id: string;
  company: string;
  jobTitle: string;
  date: string;
  data: any;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load history from localStorage (only runs client-side)
    setHistory(getResponseHistory());
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    deleteResponseFromHistory(id);
    setHistory(getResponseHistory());
  };

  return (
    <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center mb-8 space-x-4'>
        <Link href='/' className='shrink-0'>
          <Button variant='outline' size='sm' className='rounded-full'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Back
          </Button>
        </Link>
        <div>
          <h1 className='text-4xl font-bold tracking-tight'>
            Response History
          </h1>
          <p className='text-muted-foreground mt-1'>
            View and manage your previously generated responses
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
        </div>
      ) : history.length === 0 ? (
        <Card className='text-center py-16 border-dashed'>
          <CardContent className='space-y-6'>
            <div className='flex justify-center'>
              <div className='bg-muted h-24 w-24 rounded-full flex items-center justify-center'>
                <Clock className='h-12 w-12 text-muted-foreground' />
              </div>
            </div>
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold'>No response history yet</h2>
              <p className='text-muted-foreground max-w-md mx-auto'>
                Generate your first response to see it appear here. All your
                responses will be saved automatically.
              </p>
            </div>
            <Link href='/'>
              <Button size='lg' className='mt-4'>
                Generate Your First Response
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {history.map((item) => (
            <Card
              key={item.id}
              className='overflow-hidden hover:shadow-md transition-all border'
            >
              <CardHeader className='pb-2'>
                <CardTitle className='line-clamp-1 text-xl'>
                  {item.jobTitle}
                </CardTitle>
                <CardDescription className='flex items-center'>
                  <Building className='h-3.5 w-3.5 mr-1.5 inline-block' />
                  {item.company}
                </CardDescription>
              </CardHeader>

              <CardContent className='pb-2'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <Clock className='h-3.5 w-3.5 mr-1.5' />
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </CardContent>

              <CardFooter className='flex justify-between pt-2 border-t bg-muted/30'>
                <Link href={`/response/${item.id}`} className='w-full'>
                  <Button variant='secondary' size='sm' className='w-full'>
                    <ExternalLink className='h-4 w-4 mr-2' /> View Response
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='ml-2 text-destructive hover:bg-destructive/10 hover:text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this response?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the response for "
                        {item.jobTitle}" at "{item.company}"? This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className='bg-destructive hover:bg-destructive/90'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
