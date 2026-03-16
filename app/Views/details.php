<?= $this->include('templates/header') ?>

<link rel="stylesheet" href="<?= base_url('css/details.css') ?>">

<?php
// ==========================================
//    DATABASE SIMULATION (ALL SMISKI DATA)
// ==========================================
$all_products = [
    // ========================
    // 1. EVENT & THEME SERIES
    // ========================
    'birthday' => [
        'name' => 'Birthday Series',
        'katakana' => 'バースデー シリーズ',
        'desc' => 'Celebrate a special day with these festive Smiskis.',
        'img'  => base_url('uploads/coverbday.webp'),
        'variations' => [
            ['name' => 'Giving a Bouquet', 'desc' => 'SMISKI is giving a flower bouquet.', 'img' => base_url('uploads/variations/birthday/bouquet.png')],
            ['name' => 'Wrapped Up', 'desc' => 'SMISKI pretends to be a present.', 'img' => base_url('uploads/variations/birthday/wrapped.png')],
            ['name' => 'Popping Confetti', 'desc' => 'SMISKI is popping a confetti cannon.', 'img' => base_url('uploads/variations/birthday/confetti.png')],
            ['name' => 'Birthday Message', 'desc' => 'SMISKI carries a birthday message.', 'img' => base_url('uploads/variations/birthday/message.png')],
            ['name' => 'Decorating', 'desc' => 'Little SMISKI decorating a party.', 'img' => base_url('uploads/variations/birthday/decorating.png')],
            ['name' => 'Tasting', 'desc' => 'SMISKI is tasting a birthday cake.', 'img' => base_url('uploads/variations/birthday/tasting.png')]
        ]
    ],
    'sunday' => [
        'name' => 'Sunday Series',
        'katakana' => 'サンデー シリーズ',
        'desc' => 'Relaxing and enjoying a lazy weekend.',
        'img'  => base_url('uploads/coversunday.jpg'),
        'variations' => [
            ['name' => 'Blowing Bubbles', 'desc' => 'SMISKI is playing with soap bubbles.', 'img' => base_url('uploads/variations/sunday/bubbles.png')],
            ['name' => 'Paper Airplane', 'desc' => 'SMISKI flies paper airplanes.', 'img' => base_url('uploads/variations/sunday/airplane.png')],
            ['name' => 'Sunbathing', 'desc' => 'SMISKI taking a warm nap in the sun.', 'img' => base_url('uploads/variations/sunday/sunbathing.png')],
            ['name' => 'Sing-Along', 'desc' => 'SMISKI sings while playing the guitar.', 'img' => base_url('uploads/variations/sunday/singalong.png')],
            ['name' => 'Skateboarding', 'desc' => 'SMISKI is so cool riding a skateboard!', 'img' => base_url('uploads/variations/sunday/skateboard.png')],
            ['name' => 'Gardening', 'desc' => 'SMISKI loves flowers and plants.', 'img' => base_url('uploads/variations/sunday/gardening.png')]
        ]
    ],
    'moving' => [
        'name' => 'Moving Series',
        'katakana' => 'ムービング シリーズ',
        'desc' => 'Helping you pack and move to a new corner.',
        'img'  => base_url('uploads/covermoving.jpg'),
        'variations' => [
            ['name' => 'Carrying Ladder', 'desc' => 'SMISKI is carrying a ladder.', 'img' => base_url('uploads/variations/moving/ladder.png')],
            ['name' => 'Balancing Boxes', 'desc' => 'SMISKI is carefully balancing packages.', 'img' => base_url('uploads/variations/moving/boxes.png')],
            ['name' => 'Decorating', 'desc' => 'SMISKI is holding his favorite lamp.', 'img' => base_url('uploads/variations/moving/decorating.png')],
            ['name' => 'Teamwork', 'desc' => 'Little SMISKI moving a large box.', 'img' => base_url('uploads/variations/moving/teamwork.png')],
            ['name' => 'Green Thumb', 'desc' => 'SMISKI is carrying a cactus.', 'img' => base_url('uploads/variations/moving/cactus.png')],
            ['name' => 'Falling Down', 'desc' => 'SMISKI trips and falls with his package.', 'img' => base_url('uploads/variations/moving/falling.png')]
        ]
    ],
    'exercising' => [
        'name' => 'Exercising Series',
        'katakana' => 'エクササイズ シリーズ',
        'desc' => 'Getting fit and staying healthy.',
        'img'  => base_url('uploads/coverexercise.webp'),
        'variations' => [
            ['name' => 'Doing Crunches', 'desc' => 'SMISKI is working his abs.', 'img' => base_url('uploads/variations/exercise/crunches.png')],
            ['name' => 'Aerobics', 'desc' => 'SMISKI is doing aerobics.', 'img' => base_url('uploads/variations/exercise/aerobics.png')],
            ['name' => 'Little Balance', 'desc' => 'Little SMISKI is on a balance ball.', 'img' => base_url('uploads/variations/exercise/balance.png')],
            ['name' => 'Dumbbell', 'desc' => 'SMISKI is doing weight training.', 'img' => base_url('uploads/variations/exercise/dumbbell.png')],
            ['name' => 'Hoop', 'desc' => 'SMISKI hooping and breaking a sweat.', 'img' => base_url('uploads/variations/exercise/hoop.png')],
            ['name' => 'Stretch', 'desc' => 'SMISKI is doing stretches.', 'img' => base_url('uploads/variations/exercise/stretch.png')]
        ]
    ],
    'dressing' => [
        'name' => 'Dressing Series',
        'katakana' => 'ドレッシング シリーズ',
        'desc' => 'Getting ready for the day implies struggles.',
        'img'  => base_url('uploads/coverdressing.webp'),
        'variations' => [
            ['name' => 'Underpants', 'desc' => 'SMISKI putting on underpants.', 'img' => base_url('uploads/variations/dressing/underpants.png')],
            ['name' => 'Struggling', 'desc' => 'A sad SMISKI trying on a sweater.', 'img' => base_url('uploads/variations/dressing/struggling.png')],
            ['name' => 'Loose Pants', 'desc' => 'SMISKI lost because pants are too big.', 'img' => base_url('uploads/variations/dressing/loosepants.png')],
            ['name' => 'Putting On Socks', 'desc' => 'SMISKI is putting on socks.', 'img' => base_url('uploads/variations/dressing/socks.png')],
            ['name' => 'Sweater', 'desc' => 'SMISKI is trying on a sweater.', 'img' => base_url('uploads/variations/dressing/sweater.png')],
            ['name' => 'Tight Pants', 'desc' => 'SMISKI is trying on tight pants.', 'img' => base_url('uploads/variations/dressing/tightpants.png')]
        ]
    ],
    'work' => [
        'name' => 'Work Series',
        'katakana' => 'ワーク シリーズ',
        'desc' => 'Working hard (or hardly working) at the office.',
        'img'  => base_url('uploads/work.png'),
        'variations' => [
            ['name' => 'Approving', 'desc' => 'SMISKI praises your work from the corner.', 'img' => base_url('uploads/variations/work/approving.png')],
            ['name' => 'Researching', 'desc' => 'SMISKI is searching on his computer.', 'img' => base_url('uploads/variations/work/researching.png')],
            ['name' => 'Presenting', 'desc' => 'SMISKI is presenting to the group.', 'img' => base_url('uploads/variations/work/presenting.png')],
            ['name' => 'Good Idea', 'desc' => 'SMISKI is inspired with a light bulb.', 'img' => base_url('uploads/variations/work/goodidea.png')],
            ['name' => 'On the Road', 'desc' => 'SMISKI hurries to work.', 'img' => base_url('uploads/variations/work/ontheroad.png')],
            ['name' => 'Group Think', 'desc' => 'SMISKI deliberating in a meeting.', 'img' => base_url('uploads/variations/work/groupthink.png')]
        ]
    ],
    'museum' => [
        'name' => 'Museum Series',
        'katakana' => 'ミュージアム シリーズ',
        'desc' => 'Imitating famous works of art.',
        'img'  => base_url('uploads/museum.png'),
        'variations' => [
            ['name' => 'The Source', 'desc' => 'Imitating "The Source" by Ingres.', 'img' => base_url('uploads/variations/museum/source.png')],
            ['name' => 'Fuzin & Raijin', 'desc' => 'The Wind God and Thunder God.', 'img' => base_url('uploads/variations/museum/fuzin.png')],
            ['name' => 'Bacchus', 'desc' => 'Imitating the god of wine.', 'img' => base_url('uploads/variations/museum/bacchus.png')],
            ['name' => 'Velázquez', 'desc' => 'Inspired by classical portraits.', 'img' => base_url('uploads/variations/museum/velazquez.png')],
            ['name' => 'Dalí', 'desc' => 'Inspired by The Persistence of Memory.', 'img' => base_url('uploads/variations/museum/dali.png')],
            ['name' => 'Pearl Earring', 'desc' => 'Imitating the Girl with a Pearl Earring.', 'img' => base_url('uploads/variations/museum/pearl.png')]
        ]
    ],
    'cheer' => [
        'name' => 'Cheer Series',
        'katakana' => 'チア シリーズ',
        'desc' => 'Smiski is by your side cheering for you!',
        'img'  => base_url('uploads/cheer.png'),
        'variations' => [
            ['name' => 'Marching', 'desc' => 'Marching forward with confidence.', 'img' => base_url('uploads/variations/cheer/marching.png')],
            ['name' => 'On Drums', 'desc' => 'Keeping the rhythm.', 'img' => base_url('uploads/variations/cheer/on_drums.png')],
            ['name' => 'On Your Side', 'desc' => 'Always supporting you.', 'img' => base_url('uploads/variations/cheer/on_your_side.png')],
            ['name' => 'Dancing', 'desc' => 'Dancing to cheer you up.', 'img' => base_url('uploads/variations/cheer/dancing.png')],
            ['name' => 'Little Cheerleading', 'desc' => 'Small cheers make a big difference.', 'img' => base_url('uploads/variations/cheer/little.png')],
            ['name' => 'Cheering', 'desc' => 'Go! Fight! Win!', 'img' => base_url('uploads/variations/cheer/cheering.png')]
        ]
    ],

    // ========================
    // 2. STANDARD SERIES
    // ========================
    'yoga' => [
        'name' => 'Yoga Series',
        'katakana' => 'ヨガ シリーズ',
        'desc' => 'Finding inner peace in the dark.',
        'img'  => base_url('uploads/yoga.png'),
        'variations' => [
            ['name' => 'Lotus Pose', 'desc' => 'Meditation pose.', 'img' => base_url('uploads/variations/yoga/lotus.png')],
            ['name' => 'Twist Pose', 'desc' => 'Detoxing the body.', 'img' => base_url('uploads/variations/yoga/twist.png')],
            ['name' => 'Shoulderstand', 'desc' => 'Inverting the world.', 'img' => base_url('uploads/variations/yoga/shoulderstand.png')],
            ['name' => 'Triangle Pose', 'desc' => 'Stretching the sides.', 'img' => base_url('uploads/variations/yoga/triangle.png')],
            ['name' => 'Tree Pose', 'desc' => 'Balancing act.', 'img' => base_url('uploads/variations/yoga/tree.png')],
            ['name' => 'Ship Pose', 'desc' => 'Core strength.', 'img' => base_url('uploads/variations/yoga/ship.png')]
        ]
    ],
    'bed' => [
        'name' => 'Bed Series',
        'katakana' => 'ベッド シリーズ',
        'desc' => 'They glow beside you while you sleep.',
        'img'  => base_url('uploads/bed.png'),
        'variations' => [
            ['name' => 'Before Rest', 'desc' => 'Preparing for sleep.', 'img' => base_url('uploads/variations/bed/beforerest.png')],
            ['name' => 'Sleepy', 'desc' => 'Rubbing eyes.', 'img' => base_url('uploads/variations/bed/sleepy.png')],
            ['name' => 'Co-sleeping', 'desc' => 'Sleeping together.', 'img' => base_url('uploads/variations/bed/cosleeping.png')],
            ['name' => 'Reading', 'desc' => 'Reading a bedtime story.', 'img' => base_url('uploads/variations/bed/reading.png')],
            ['name' => 'At Sleep', 'desc' => 'Deep in dreams.', 'img' => base_url('uploads/variations/bed/atsleep.png')],
            ['name' => 'Fussing', 'desc' => 'Can\'t find a comfortable spot.', 'img' => base_url('uploads/variations/bed/fussing.png')]
        ]
    ],
    'living' => [
        'name' => 'Living Series',
        'katakana' => 'リビング シリーズ',
        'desc' => 'Smiskis that hide in plain sight in your living room.',
        'img'  => base_url('uploads/living.png'),
        'variations' => [
            ['name' => 'Daydreaming', 'desc' => 'Lost in thought.', 'img' => base_url('uploads/variations/living/daydreaming.png')],
            ['name' => 'Playing', 'desc' => 'Hide and seek pro.', 'img' => base_url('uploads/variations/living/playing.png')],
            ['name' => 'Hiding', 'desc' => 'Peeking behind things.', 'img' => base_url('uploads/variations/living/hiding.png')],
            ['name' => 'Nap Time', 'desc' => 'Sleeping peacefully.', 'img' => base_url('uploads/variations/living/naptime.png')],
            ['name' => 'Thinking', 'desc' => 'Solving problems.', 'img' => base_url('uploads/variations/living/thinking.png')],
            ['name' => 'Lifting', 'desc' => 'Moving things around.', 'img' => base_url('uploads/variations/living/lifting.png')]
        ]
    ],
    'bath' => [
        'name' => 'Bath Series',
        'katakana' => 'バス シリーズ',
        'desc' => 'Relaxing in the tub with Smiski.',
        'img'  => base_url('uploads/bath.png'),
        'variations' => [
            ['name' => 'Shampooing', 'desc' => 'Smiski trying to copy how to shampoo.', 'img' => base_url('uploads/variations/bath/shampooing.png')],
            ['name' => 'Not Looking', 'desc' => 'Very shy Smiski.', 'img' => base_url('uploads/variations/bath/notlooking.png')],
            ['name' => 'Scrubbing', 'desc' => 'Smiski that loves to scrub each other.', 'img' => base_url('uploads/variations/bath/scrubbing.png')],
            ['name' => 'With Duck', 'desc' => 'Playing with Duck in the bath tub.', 'img' => base_url('uploads/variations/bath/duck.png')],
            ['name' => 'Dazed', 'desc' => 'Relaxing and enjoying the bath.', 'img' => base_url('uploads/variations/bath/dazed.png')],
            ['name' => 'Looking', 'desc' => 'Saw the bath room for the first time.', 'img' => base_url('uploads/variations/bath/looking.png')]
        ]
    ],
    'toilet' => [
        'name' => 'Toilet Series',
        'katakana' => 'トイレ シリーズ',
        'desc' => 'Funny little guys hanging out in the bathroom.',
        'img'  => base_url('uploads/toilet.png'),
        'variations' => [
            ['name' => 'Peek-A-Boo', 'desc' => 'Peeking from the Toilet Paper roll.', 'img' => base_url('uploads/variations/toilet/peekaboo.png')],
            ['name' => 'Little (Smelly)', 'desc' => 'Holding breath because of smell.', 'img' => base_url('uploads/variations/toilet/little.png')],
            ['name' => 'Squatting', 'desc' => 'Always squatting but doesn’t know why.', 'img' => base_url('uploads/variations/toilet/squatting.png')],
            ['name' => 'Helping Out', 'desc' => 'Helping in case the paper runs out.', 'img' => base_url('uploads/variations/toilet/helping.png')],
            ['name' => 'Resting', 'desc' => 'Observing the rest room.', 'img' => base_url('uploads/variations/toilet/resting.png')],
            ['name' => 'Holding In', 'desc' => 'Holding in too long to even move.', 'img' => base_url('uploads/variations/toilet/holdingin.png')]
        ]
    ],
    'series4' => [
        'name' => 'Series 4',
        'katakana' => 'シリーズ 4',
        'desc' => 'The fourth generation of glowing friends.',
        'img'  => base_url('uploads/series4.png'),
        'variations' => [
            ['name' => 'Sneaking', 'desc' => 'Always sneaking and secretly moving.', 'img' => base_url('uploads/variations/s4/sneaking.png')],
            ['name' => 'Scared', 'desc' => 'Wants to go down but scared to.', 'img' => base_url('uploads/variations/s4/scared.png')],
            ['name' => 'Relaxing', 'desc' => 'Full and cannot move.', 'img' => base_url('uploads/variations/s4/relaxing.png')],
            ['name' => 'Lazy', 'desc' => 'Always lazy.', 'img' => base_url('uploads/variations/s4/lazy.png')],
            ['name' => 'Stuck', 'desc' => 'Got stuck on a way to somewhere.', 'img' => base_url('uploads/variations/s4/stuck.png')],
            ['name' => 'Defeated', 'desc' => 'Cannot find any favorite corner.', 'img' => base_url('uploads/variations/s4/defeated.png')]
        ]
    ],
    'series3' => [
        'name' => 'Series 3',
        'katakana' => 'シリーズ 3',
        'desc' => 'More poses and more fun.',
        'img'  => base_url('uploads/series3.png'),
        'variations' => [
            ['name' => 'Bridge', 'desc' => 'To think flexibly, one must act flexibly!', 'img' => base_url('uploads/variations/s3/bridge.png')],
            ['name' => 'Peeking', 'desc' => 'Finds comfort in high places.', 'img' => base_url('uploads/variations/s3/peeking.png')],
            ['name' => 'Climbing', 'desc' => 'Curious of what is waiting at the top.', 'img' => base_url('uploads/variations/s3/climbing.png')],
            ['name' => 'Little', 'desc' => 'Lining up against the wall.', 'img' => base_url('uploads/variations/s3/little.png')],
            ['name' => 'Hiding', 'desc' => 'Found underneath towels and blankets.', 'img' => base_url('uploads/variations/s3/hiding.png')],
            ['name' => 'Handstand', 'desc' => 'Doing a handstand against the wall.', 'img' => base_url('uploads/variations/s3/handstand.png')]
        ]
    ],
    'series2' => [
        'name' => 'Series 2',
        'katakana' => 'シリーズ 2',
        'desc' => 'The second wave of Smiski.',
        'img'  => base_url('uploads/series2.png'),
        'variations' => [
            ['name' => 'Kneeling', 'desc' => 'Often sits with knees folded.', 'img' => base_url('uploads/variations/s2/kneeling.png')],
            ['name' => 'Climbing', 'desc' => 'Trying to climb over things.', 'img' => base_url('uploads/variations/s2/climbing.png')],
            ['name' => 'Daydreaming', 'desc' => 'Likes to daydream all day long.', 'img' => base_url('uploads/variations/s2/daydreaming.png')],
            ['name' => 'Pushing', 'desc' => 'Always pushing things together.', 'img' => base_url('uploads/variations/s2/pushing.png')],
            ['name' => 'Peeking', 'desc' => 'Looking out from an upside down view.', 'img' => base_url('uploads/variations/s2/peeking.png')],
            ['name' => 'Listening', 'desc' => 'Curious about sounds next door.', 'img' => base_url('uploads/variations/s2/listening.png')]
        ]
    ],
    'series1' => [
        'name' => 'Series 1',
        'katakana' => 'シリーズ 1',
        'desc' => 'The original glow in the dark figures.',
        'img'  => base_url('uploads/series1.png'),
        'variations' => [
            ['name' => 'Hugging Knees', 'desc' => 'Hugging knees, staring into distance.', 'img' => base_url('uploads/variations/s1/hugging.png')],
            ['name' => 'Sitting', 'desc' => 'Sitting silently. Wary personality.', 'img' => base_url('uploads/variations/s1/sitting.png')],
            ['name' => 'Looking Back', 'desc' => 'Scares easily. Will turn back and stare.', 'img' => base_url('uploads/variations/s1/lookingback.png')],
            ['name' => 'Lounging', 'desc' => 'Lazy Smiski that likes to lie down.', 'img' => base_url('uploads/variations/s1/lounging.png')],
            ['name' => 'Hiding', 'desc' => 'Hiding is his specialty.', 'img' => base_url('uploads/variations/s1/hiding.png')],
            ['name' => 'Peeking', 'desc' => 'Hunched over and peeking.', 'img' => base_url('uploads/variations/s1/peeking.png')]
        ]
    ],

    // ========================
    // 3. ACCESSORIES (Hippers & Straps)
    // ========================
    'hippers' => [
        'name' => 'Smiski Hippers',
        'katakana' => 'スミスキー ヒッパーズ',
        'desc' => 'Attachable figures for your devices.',
        'img'  => base_url('uploads/coverhipper.webp'),
        'variations' => [
            ['name' => 'On His Smartphone', 'desc' => 'Protecting your phone.', 'img' => base_url('uploads/variations/hip/smartphone.png')],
            ['name' => 'Trying to Climb', 'desc' => 'Almost there!', 'img' => base_url('uploads/variations/hip/climbing.png')],
            ['name' => 'Looking Out', 'desc' => 'Watching the world.', 'img' => base_url('uploads/variations/hip/looking.png')],
            ['name' => 'Sticking', 'desc' => 'Hanging on tight.', 'img' => base_url('uploads/variations/hip/sticking.png')],
            ['name' => 'Dozing', 'desc' => 'Falling asleep on your screen.', 'img' => base_url('uploads/variations/hip/dozing.png')],
            ['name' => 'Upside Down', 'desc' => 'A new perspective.', 'img' => base_url('uploads/variations/hip/upsidedown.png')]
        ]
    ],
    'strap1' => [
        'name' => 'Strap Series 1',
        'katakana' => 'ストラップ シリーズ 1',
        'desc' => 'Take your Smiski everywhere you go.',
        'img'  => base_url('uploads/strap1.png'),
        'variations' => [
            ['name' => 'Peeking', 'desc' => 'Always hunched over and peeking.', 'img' => base_url('uploads/variations/strap1/peeking.png')],
            ['name' => 'Hugging Knees', 'desc' => 'Hugging knees in the corner.', 'img' => base_url('uploads/variations/strap1/hugging.png')],
            ['name' => 'Looking Back', 'desc' => 'Scares easily.', 'img' => base_url('uploads/variations/strap1/looking.png')],
            ['name' => 'Sitting', 'desc' => 'Often found sitting silently.', 'img' => base_url('uploads/variations/strap1/sitting.png')],
            ['name' => 'Hiding', 'desc' => 'Hiding is his specialty.', 'img' => base_url('uploads/variations/strap1/hiding.png')],
            ['name' => 'Lounging', 'desc' => 'Lazy Smiski that likes to lie down.', 'img' => base_url('uploads/variations/strap1/lounging.png')]
        ]
    ],
    'strap2' => [
        'name' => 'Strap Series 2',
        'katakana' => 'ストラップ シリーズ 2',
        'desc' => 'More poses for your bag or keys.',
        'img'  => base_url('uploads/strap2.png'),
        'variations' => [
            ['name' => 'Kneeling', 'desc' => 'Often sits with knees folded.', 'img' => base_url('uploads/variations/strap2/kneeling.png')],
            ['name' => 'Pushing', 'desc' => 'Always pushing things together.', 'img' => base_url('uploads/variations/strap2/pushing.png')],
            ['name' => 'Listening', 'desc' => 'Curious about the sounds.', 'img' => base_url('uploads/variations/strap2/listening.png')],
            ['name' => 'Climbing', 'desc' => 'Trying to climb over things.', 'img' => base_url('uploads/variations/strap2/climbing.png')],
            ['name' => 'Peeking', 'desc' => 'Looking from upside down.', 'img' => base_url('uploads/variations/strap2/peeking.png')],
            ['name' => 'Daydreaming', 'desc' => 'Likes to daydream all day long.', 'img' => base_url('uploads/variations/strap2/daydreaming.png')]
        ]
    ],
    'strap3' => [
        'name' => 'Strap Series 3',
        'katakana' => 'ストラップ シリーズ 3',
        'desc' => 'Adventure straps for your travels.',
        'img'  => base_url('uploads/strap3.png'),
        'variations' => [
            ['name' => 'Bridge', 'desc' => 'To think flexibly, one must act flexibly!', 'img' => base_url('uploads/variations/strap3/bridge.png')],
            ['name' => 'Peeking', 'desc' => 'Finds comfort in high places.', 'img' => base_url('uploads/variations/strap3/peeking.png')],
            ['name' => 'Handstand', 'desc' => 'Doing a handstand.', 'img' => base_url('uploads/variations/strap3/handstand.png')],
            ['name' => 'Climbing', 'desc' => 'Loves adventure and climbing.', 'img' => base_url('uploads/variations/strap3/climbing.png')],
            ['name' => 'Little', 'desc' => 'Little ones lining up.', 'img' => base_url('uploads/variations/strap3/little.png')],
            ['name' => 'Hiding', 'desc' => 'Likes to be in small, cosy places.', 'img' => base_url('uploads/variations/strap3/hiding.png')]
        ]
    ],

    // ========================
    // 4. LIFESTYLE (Single Items - Fallback)
    // ========================
    'light' => [
        'name' => 'Touch Light',
        'katakana' => 'タッチライト',
        'desc' => 'A gentle glow with just a tap.',
        'img'  => base_url('uploads/touch-light.png'),
        'variations' => [] 
    ],
    'toothbrush' => [
        'name' => 'Toothbrush Stand',
        'katakana' => '歯ブラシスタンド',
        'desc' => 'Protecting your toothbrush efficiently.',
        'img'  => base_url('uploads/brushstand.png'),
        'variations' => []
    ],
    'bobbing' => [
        'name' => 'Bobbing Head',
        'katakana' => 'ボビングヘッド',
        'desc' => 'A nodding companion for your desk.',
        'img'  => base_url('uploads/bobhead.png'),
        'variations' => []
    ]
];

// GET Logic
$id = $_GET['item'] ?? 'living';
$current_item = $all_products[$id] ?? $all_products['living'];
?>

<div class="container pt-4 pb-5"> 
    
    <div class="mb-4">
        <a href="<?= base_url('customer/catalog') ?>" class="back-link">
            &larr; Return to Collection
        </a>
    </div>

    <header class="text-center mb-5">
        <h1 class="display-4 katakana-title mb-2">
            <?= esc($current_item['katakana']) ?>
        </h1>
        <p class="h5 english-subtitle mb-4">
            <?= esc($current_item['name']) ?>
        </p>
        <div class="d-flex justify-content-center mt-4">
            <img src="<?= $current_item['img'] ?>" alt="<?= esc($current_item['name']) ?>" class="header-img">
        </div>
        <p class="mt-3 text-muted" style="max-width: 500px; margin: 0 auto;">
            <?= esc($current_item['desc']) ?>
        </p>
    </header>

    <?php if (!empty($current_item['variations'])): ?>

        <div class="row g-5 mb-5 justify-content-center">
            <?php foreach($current_item['variations'] as $variant): ?>
                <div class="col-6 col-md-4 d-flex flex-column align-items-center">
                    
                    <div class="product-image-box">
                        <?php if(!empty($variant['img'])): ?>
                            <img src="<?= $variant['img'] ?>" alt="<?= esc($variant['name']) ?>" class="variant-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <i class="bi bi-stars fs-1" style="display:none;"></i>
                        <?php else: ?>
                            <i class="bi bi-stars fs-1"></i>
                        <?php endif; ?>
                    </div>

                    <div class="yellow-pill-label mb-2 text-center">
                        <?= esc($variant['name']) ?>
                    </div>

                    <p class="desc-text text-center">
                        <?= esc($variant['desc']) ?>
                    </p>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="container text-center mb-5">
            <img src="<?= base_url('uploads/sets/' . $id . '.png') ?>" alt="Complete Set" class="series-set-img" onerror="this.style.display='none'">
        </div>

        <div class="row g-4 justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="info-box">
                    <div class="icon-circle green">?</div>
                    <h3 class="h5 info-title">Secret Figure</h3>
                    <p class="info-desc mb-0">
                        Each series contains one secret Smiski. The probability of finding one is 1/144. Good luck hunting!
                    </p>
                </div>
            </div>

            <div class="col-md-6 col-lg-5">
                <div class="info-box">
                    <div class="icon-circle white">
                        <i class="bi bi-box"></i>
                    </div>
                    <h3 class="h5 info-title">Blind Box Info</h3>
                    <p class="info-desc mb-4">
                        Smiski come packaged randomly in blind boxes so you won't know which one you'll get until you open the box.
                    </p>

                    </a>
                </div>
            </div>
        </div>

    <?php else: ?>
        
        <div class="d-flex flex-column align-items-center">
            
            <div class="product-image-box mb-4" style="max-width: 350px;">
                <img src="<?= $current_item['img'] ?>" class="variant-img">
            </div>

            <div class="yellow-pill-label fs-5 mb-3 px-5 py-2">
                <?= esc($current_item['name']) ?>
            </div>

            <p class="text-muted text-center mb-5" style="max-width: 400px;">
                <?= esc($current_item['desc']) ?>
            </p>

            <div class="col-md-8 col-lg-6">
                <div class="info-box">
                    <h3 class="h5 info-title">Specifications</h3>
                    <p class="info-desc mb-4">
                        High quality material. Perfect for home decoration and daily use.
                    </p>
                    <a href="<?= base_url('customer/shop') ?>" class="btn btn-smiski px-5">
                        Add to Cart
                    </a>
                </div>
            </div>
        </div>

    <?php endif; ?>

</div>

<?= $this->include('templates/footer') ?>