/*
 * Copyright (c) 1999 Apple Computer, Inc. All rights reserved.
 *
 * @APPLE_LICENSE_HEADER_START@
 * 
 * Portions Copyright (c) 1999 Apple Computer, Inc.  All Rights
 * Reserved.  This file contains Original Code and/or Modifications of
 * Original Code as defined in and that are subject to the Apple Public
 * Source License Version 1.1 (the "License").  You may not use this file
 * except in compliance with the License.  Please obtain a copy of the
 * License at http://www.apple.com/publicsource and read it before using
 * this file.
 * 
 * The Original Code and all software distributed under the License are
 * distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE OR NON- INFRINGEMENT.  Please see the
 * License for the specific language governing rights and limitations
 * under the License.
 * 
 * @APPLE_LICENSE_HEADER_END@
 */
/*
 * Sun RPC is a product of Sun Microsystems, Inc. and is provided for
 * unrestricted use provided that this legend is included on all tape
 * media and as a part of the software program in whole or part.  Users
 * may copy or modify Sun RPC without charge, but are not authorized
 * to license or distribute it to anyone else except as part of a product or
 * program developed by the user.
 * 
 * SUN RPC IS PROVIDED AS IS WITH NO WARRANTIES OF ANY KIND INCLUDING THE
 * WARRANTIES OF DESIGN, MERCHANTIBILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE, OR ARISING FROM A COURSE OF DEALING, USAGE OR TRADE PRACTICE.
 * 
 * Sun RPC is provided with no support and without any obligation on the
 * part of Sun Microsystems, Inc. to assist in its use, correction,
 * modification or enhancement.
 * 
 * SUN MICROSYSTEMS, INC. SHALL HAVE NO LIABILITY WITH RESPECT TO THE
 * INFRINGEMENT OF COPYRIGHTS, TRADE SECRETS OR ANY PATENTS BY SUN RPC
 * OR ANY PART THEREOF.
 * 
 * In no event will Sun Microsystems, Inc. be liable for any lost revenue
 * or profits or other special, indirect and consequential damages, even if
 * Sun has been advised of the possibility of such damages.
 * 
 * Sun Microsystems, Inc.
 * 2550 Garcia Avenue
 * Mountain View, California  94043
 *
 *	from: @(#)auth_unix.h 1.8 88/02/08 SMI
 *	from: @(#)auth_unix.h	2.2 88/07/29 4.0 RPCSRC
 *	$Id: auth_unix.h,v 1.4 2004/10/28 21:58:21 emoy Exp $
 */

/*
 * auth_unix.h, Protocol for UNIX style authentication parameters for RPC
 *
 * Copyright (C) 1984, Sun Microsystems, Inc.
 */

/*
 * The system is very weak.  The client uses no encryption for  it
 * credentials and only sends null verifiers.  The server sends backs
 * null verifiers or optionally a verifier that suggests a new short hand
 * for the credentials.
 */

#ifndef _RPC_AUTH_UNIX_H
#define _RPC_AUTH_UNIX_H
#include <sys/cdefs.h>

/* The machine name is part of a credential; it may not exceed 255 bytes */
#define MAX_MACHINE_NAME 255

/*
 * Unix style credentials.
 */
struct authunix_parms {
#ifdef __LP64__
	unsigned int	 aup_time;
#else
	unsigned long	 aup_time;
#endif
	char	*aup_machname;
	int	 aup_uid;
	int	 aup_gid;
	unsigned int	 aup_len;
	int	*aup_gids;
};

__BEGIN_DECLS
extern bool_t xdr_authunix_parms __P((XDR *, struct authunix_parms *));
__END_DECLS

/* 
 * If a response verifier has flavor AUTH_SHORT, 
 * then the body of the response verifier encapsulates the following structure;
 * again it is serialized in the obvious fashion.
 */
struct short_hand_verf {
	struct opaque_auth new_cred;
};

#endif /* !_RPC_AUTH_UNIX_H */
