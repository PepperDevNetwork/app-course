package jp.softbank.sampleapp;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Handler;
import android.os.Bundle;
import android.support.v4.view.MenuItemCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.app.MediaRouteActionProvider;
import android.support.v7.app.MediaRouteButton;
import android.support.v7.media.MediaRouteSelector;
import android.support.v7.media.MediaRouter;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.aldebaran.qi.AnyObject;
import com.aldebaran.qi.Future;
import com.aldebaran.qi.QiSignalConnection;
import com.aldebaran.qi.QiSignalListener;
import com.aldebaran.qi.Session;
import com.google.android.gms.cast.CastDevice;
import com.google.android.gms.cast.CastMediaControlIntent;
import com.google.android.gms.cast.MediaInfo;
import com.google.android.gms.cast.MediaMetadata;
import com.google.android.gms.cast.framework.CastButtonFactory;
import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.SessionManagerListener;
import com.google.android.gms.cast.framework.media.RemoteMediaClient;
import com.google.android.gms.common.images.WebImage;

import java.util.List;
import java.util.concurrent.ExecutionException;


public class MainActivity extends AppCompatActivity {

    private Session mSession = null;
    private Button mButtonStart = null;
    private Button mButtonStop = null;
    private AnyObject mALMemory = null;
    private EditText mEditText = null;
    private Handler mHandler = null;
    private CastSession mCastSession = null;

    private View mCastLayout = null;
    private View mPepperLayout = null;

    private CastContext mCastContext;
    private MediaRouteButton mMediaRouteButton;

    private final SessionManagerListener mSessionManagerListener = new SessionManagerListener<CastSession>() {
        @Override
        public void onSessionStarting(CastSession castSession) {
        }

        @Override
        public void onSessionStarted(CastSession castSession, String s) {
            mCastSession = castSession;
            mCastLayout.setVisibility(View.GONE);
            mPepperLayout.setVisibility(View.VISIBLE);
        }

        @Override
        public void onSessionStartFailed(CastSession castSession, int i) {
            // nop
        }

        @Override
        public void onSessionEnding(CastSession castSession) {
            // nop
        }

        @Override
        public void onSessionEnded(CastSession castSession, int i) {
            mCastLayout.setVisibility(View.VISIBLE);
            mPepperLayout.setVisibility(View.GONE);
            stop();
        }

        @Override
        public void onSessionResuming(CastSession castSession, String s) {
            // nop
        }

        @Override
        public void onSessionResumed(CastSession castSession, boolean b) {
            // nop
        }

        @Override
        public void onSessionResumeFailed(CastSession castSession, int i) {
            // nop
        }

        @Override
        public void onSessionSuspended(CastSession castSession, int i) {
            // nop
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mHandler = new Handler();

        mButtonStart = (Button)findViewById(R.id.btn_start);
        mButtonStop = (Button)findViewById(R.id.btn_stop);
        mEditText = ((EditText)findViewById(R.id.text_ip));

        mCastLayout = findViewById(R.id.layout_cast);
        mPepperLayout = findViewById(R.id.layout_pepper);

        mButtonStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                start();
            }
        });

        mButtonStop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(mButtonStop.isEnabled()) {
                    mButtonStop.setEnabled(false);
                    if(mSession != null) {
                        if(mSession.isConnected()) {
                            mSession.close();
                        }else{
                            stop();
                        }
                    }
                }
            }
        });

        mCastContext = CastContext.getSharedInstance(this);
        mMediaRouteButton = (MediaRouteButton) findViewById(R.id.media_route_button);
        CastButtonFactory.setUpMediaRouteButton(getApplicationContext(), mMediaRouteButton);
    }

    private void start(){
        if(mButtonStart.isEnabled()){
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    mEditText.setEnabled(false);
                    mButtonStart.setEnabled(false);
                    mButtonStop.setEnabled(true);
                }
            });

            String ip = mEditText.getText().toString();
            mSession = new Session();
            mSession.addConnectionListener(new Session.ConnectionListener() {
                @Override
                public void onConnected() {
                    try {
                        Future<AnyObject> any = mSession.service("ALMemory");
                        mALMemory = (AnyObject) any.get();
                        mALMemory.call("raiseEvent", "ComSoftbankrobotics/SampleProject/Phone/Connected", 1 );

                        try {
                            AnyObject subscriber = null;
                            subscriber = mALMemory.<AnyObject>call("subscriber", "ComSoftbankrobotics/SampleProject/Cast/Play").get();
                            subscriber.connect("signal::(m)", new QiSignalListener() {
                                @Override
                                public void onSignalReceived(Object... objects) {
                                    try {
                                        playMovie(objects[0].toString());
                                    }catch(Exception e){
                                        e.printStackTrace();
                                    }
                                }
                            });
                        } catch (ExecutionException e) {
                            e.printStackTrace();
                        }

                        mHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(getApplicationContext(), getResources().getString(R.string.toast_success), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }catch(Exception e){
                        mSession.close();
                    }
                }
                @Override
                public void onDisconnected(String s) {
                    stop();
                }
            });
            mSession.connect(ip);
        }
    }

    private void stop(){
        mSession = null;
        mALMemory = null;
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                mEditText.setEnabled(true);
                mButtonStart.setEnabled(true);
                mButtonStop.setEnabled(false);
            }
        });
    }

    private void playMovie(final String url){
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                MediaMetadata movieMetadata = new MediaMetadata(MediaMetadata.MEDIA_TYPE_MOVIE);
                MediaInfo mediaInfo = new MediaInfo.Builder(url)
                        .setStreamType(MediaInfo.STREAM_TYPE_BUFFERED)
                        .setContentType("videos/mp4")
                        .setMetadata(movieMetadata)
                        .build();
                final RemoteMediaClient remoteMediaClient = mCastSession.getRemoteMediaClient();
                remoteMediaClient.load(mediaInfo, true, 0);
            }
        });
    }

    @Override
    protected void onResume() {
        mCastContext.getSessionManager().addSessionManagerListener(mSessionManagerListener, CastSession.class);
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mCastContext.getSessionManager().removeSessionManagerListener(mSessionManagerListener, CastSession.class);
    }

    @Override
    public void onDestroy(){
        super.onDestroy();
        if(mSession != null){
            mSession.close();
        }
    }
}
