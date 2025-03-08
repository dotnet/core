/*
 * Copyright (c) 2012-2013, 2015 Apple Inc. All rights reserved.
 *
 * @APPLE_OSREFERENCE_LICENSE_HEADER_START@
 *
 * This file contains Original Code and/or Modifications of Original Code
 * as defined in and that are subject to the Apple Public Source License
 * Version 2.0 (the 'License'). You may not use this file except in
 * compliance with the License. The rights granted to you under the License
 * may not be used to create, or enable the creation or redistribution of,
 * unlawful or unlicensed copies of an Apple operating system, or to
 * circumvent, violate, or enable the circumvention or violation of, any
 * terms of an Apple operating system software license agreement.
 *
 * Please obtain a copy of the License at
 * http://www.opensource.apple.com/apsl/ and read it before using this file.
 *
 * The Original Code and all software distributed under the License are
 * distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
 * EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
 * Please see the License for the specific language governing rights and
 * limitations under the License.
 *
 * @APPLE_OSREFERENCE_LICENSE_HEADER_END@
 */

#ifndef _TASK_CORPSE_H_
#define _TASK_CORPSE_H_

#include <stdint.h>
#include <mach/mach_types.h>
#include <kern/kern_cdata.h>
#include <kern/kcdata.h>

typedef struct kcdata_item      *task_crashinfo_item_t;

/* Deprecated: use the KCDATA_* macros for all future use */
#define CRASHINFO_ITEM_TYPE(item)                 KCDATA_ITEM_TYPE(item)
#define CRASHINFO_ITEM_SIZE(item)                 KCDATA_ITEM_SIZE(item)
#define CRASHINFO_ITEM_DATA_PTR(item)     KCDATA_ITEM_DATA_PTR(item)

#define CRASHINFO_ITEM_NEXT_HEADER(item)  KCDATA_ITEM_NEXT_HEADER(item)

#define CRASHINFO_ITEM_FOREACH(head)      KCDATA_ITEM_FOREACH(head)


#define task_crashinfo_get_data_with_desc kcdata_get_data_with_desc



#endif /* _TASK_CORPSE_H_ */
