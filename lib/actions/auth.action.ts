'use server';
import { db, auth } from '@/firebase/admin';
import { cookies } from 'next/headers';

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export async function signUp(params: SignUpParams) {
    const {uid, name,email}=params;
    try {
        const userRecord=await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {success:false, message:'User already exists. Sign in instead'};
        }
        await db.collection('users').doc(uid).set({
            uid,
            name,
            email,
            createdAt: new Date().toISOString()
        });
        return {success:true, message:'User signed up successfully'};
    } catch (e: any) {
        console.error('Error signing up user:', e);
        if (e.code === 'auth/email-already-exists') {
           return {
                success:false, 
                message:'Email already in use'
            };
        }
        return {success:false, message:'Failed to create an account'};
    }
}


export async function signIn(params: SignInParams) {
    const {email, idToken}=params;
    try {
        const userRecord=await auth.getUserByEmail(email);
        if (!userRecord) {
            return {success:false, message:'User does not exist. Sign up instead'};
        }
        
        await setSessionCookie(idToken);
        return { success: true, message: 'User signed in successfully' };
    } catch (e: any) {
        console.error('Error signing in user:', e);

        return {success:false, message:'Failed to create an account'};
    }
}

export async function setSessionCookie(idToken: string ) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {expiresIn: ONE_WEEK});

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK/1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite:'lax'
    });

}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User
    } catch (e) {
        console.error('Error verifying session cookie:', e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

